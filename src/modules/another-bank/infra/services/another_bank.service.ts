import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError, Method } from 'axios';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { throwError } from '../../../../common/helpers/throw_error';

@Injectable()
export class AnotherBankService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const requiredConfigs = [
      'another_bank.apiUrl',
      'another_bank.auth.url',
      'another_bank.auth.clientId',
      'another_bank.auth.clientSecret',
      'another_bank.auth.refreshUrl',
    ];
    for (const key of requiredConfigs) {
      if (!this.configService.get(key)) {
        throw new Error(`Missing configuration: ${key}`);
      }
    }
  }

  protected getBaseUrl(): string {
    return (
      this.configService.get<string>('another_bank.apiUrl') ?? throwError()
    );
  }

  protected async request(
    method: Method,
    url: string,
    body: Record<string, any> | undefined,
    params: Record<string, any> | undefined,
  ) {
    try {
      return await lastValueFrom(
        this.httpService.request({
          baseURL: this.getBaseUrl(),
          url: url,
          data: body,
          method: method,
          params: params,
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
        }),
      );
    } catch (e: any) {
      console.error('Error during request:', e);
      if (e instanceof AxiosError && e.response) {
        console.error('Response data:', e.response.data);
        return e.response;
      }
      throw e;
    }
  }

  protected async delCacheAccessToken(): Promise<void> {
    await this.cacheManager.del('another_bank_access_token');
  }

  protected async getCacheAccessToken(): Promise<
    Record<string, any> | undefined
  > {
    return await this.cacheManager.get<Record<string, any>>(
      'another_bank_access_token',
    );
  }

  protected async delCacheRefreshToken(): Promise<void> {
    await this.cacheManager.del('another_bank_refresh_token');
  }

  protected async getCacheRefreshToken(): Promise<
    Record<string, any> | undefined
  > {
    return await this.cacheManager.get<Record<string, any>>(
      'another_bank_refresh_token',
    );
  }

  protected async cacheAccessToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'another_bank_access_token',
      JSON.stringify({ ...token.accessToken, ...token.accessTokenExpiresAt }),
      Math.floor(
        (new Date(token.accessTokenExpiresAt).getTime() - Date.now()) / 1000,
      ),
    );
  }

  protected async cacheRefreshToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'another_bank_refresh_token',
      JSON.stringify({ ...token.refreshToken, ...token.refreshTokenExpiresAt }),
      Math.floor(
        (new Date(token.refreshTokenExpiresAt).getTime() - Date.now()) / 1000,
      ),
    );
  }

  protected async getAccessToken(): Promise<string> {
    let accessTokenInfo = await this.getCacheAccessToken();
    let refreshTokenInfo = await this.getCacheRefreshToken();

    if (
      (!accessTokenInfo && !refreshTokenInfo) ||
      (refreshTokenInfo &&
        new Date(refreshTokenInfo.refreshTokenExpiresAt) < new Date())
    ) {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('another_bank.auth.url') ??
            throwError(),
          {
            clientId:
              this.configService.get<string>('another_bank.auth.clientId') ??
              throwError(),
            clientSecret:
              this.configService.get<string>(
                'another_bank.auth.clientSecret',
              ) ?? throwError(),
          },
        ),
      );

      if (!response.data?.accessToken || !response.data?.accessTokenExpiresAt) {
        throw new Error('Invalid response data from authentication API');
      }

      await this.cacheAccessToken(response.data);
      await this.cacheRefreshToken(response.data);
      accessTokenInfo = response.data;
    }

    if (new Date(accessTokenInfo.accessTokenExpiresAt) < new Date()) {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('another_bank.auth.refreshUrl') ??
            throwError(),
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshTokenInfo.refreshToken}`,
            },
          },
        ),
      );

      if (!response.data?.accessToken || !response.data?.accessTokenExpiresAt) {
        throw new Error('Invalid response data from refresh token API');
      }

      await this.cacheAccessToken(response.data);
      accessTokenInfo = response.data;
    }

    return accessTokenInfo.accessToken;
  }
}
