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
  ) {}

  protected getBaseUrl(): string {
    return (
      this.configService.get<string>('santa_service.api_url') ?? throwError()
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
      console.log(e);
      if (e instanceof AxiosError && e.response) {
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
    return await this.cacheManager.get('another_bank_access_token');
  }

  protected async delCacheRefreshToken(): Promise<void> {
    await this.cacheManager.del('another_bank_refresh_token');
  }

  protected async getCacheRefreshToken(): Promise<
    Record<string, any> | undefined
  > {
    return await this.cacheManager.get('another_bank_refresh_token');
  }

  protected async cacheAccessToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'another_bank_access_token',
      token.accessToken,
      token.accessTokenExpiresAt,
    );
  }

  protected async cacheRefreshToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'another_bank_refresh_token',
      token.refreshToken,
      token.refreshTokenExpiresAt,
    );
  }

  protected async getAccessToken(): Promise<string> {
    let accessTokenInfo = await this.getCacheAccessToken();
    let refreshToken = await this.getCacheRefreshToken();

    if (
      (!accessTokenInfo && !refreshToken) ||
      (refreshToken && refreshToken.refreshTokenExpiresAt < new Date())
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

      await this.cacheAccessToken(response.data);
      await this.cacheRefreshToken(response.data);
      accessTokenInfo = response.data.accessToken;
    }

    if (accessTokenInfo.accessTokenExpiresAt < new Date()) {
      console.log('Implement later');
    }

    return accessTokenInfo.accessToken;
  }
}
