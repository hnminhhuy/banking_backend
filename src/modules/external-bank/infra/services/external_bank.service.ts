import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse, Method } from 'axios';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { throwError } from '../../../../common/helpers/throw_error';
import { JwtService } from '@nestjs/jwt';
import { GetConfigUsecase } from '../../../bank_config/core/usecase';

@Injectable()
export class ExternalBankService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    protected configService: ConfigService,
    protected jwtService: JwtService,
    protected getConfigUsecase: GetConfigUsecase,
  ) {
    const requiredConfigs = [
      'external_bank.apiUrl',
      'external_bank.auth.url',
      'external_bank.auth.clientId',
      'external_bank.auth.clientSecret',
      'external_bank.auth.refreshUrl',
    ];
    for (const key of requiredConfigs) {
      if (!this.configService.get(key)) {
        throw new Error(`Missing configuration: ${key}`);
      }
    }
  }

  protected getBaseUrl(): string {
    return (
      this.configService.get<string>('external_bank.apiUrl') ?? throwError()
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

  protected async safeRequest(
    method: Method,
    url: string,
    body: Record<string, any> | undefined,
    params: Record<string, any> | undefined,
  ): Promise<AxiosResponse> {
    try {
      return await this.request(method, url, body, params);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN].includes(
            error.response.status,
          )
        ) {
          await this.delCacheAccessToken();
          return await this.request(method, url, body, params);
        }
      }

      throw error;
    }
  }

  protected async delCacheAccessToken(): Promise<void> {
    await this.cacheManager.del('external_bank_access_token');
  }

  protected async getCacheAccessToken(): Promise<
    Record<string, any> | undefined
  > {
    const getCache = await this.cacheManager.get<string>(
      'external_bank_access_token',
    );
    return getCache ? JSON.parse(getCache) : undefined;
  }

  protected async delCacheRefreshToken(): Promise<void> {
    await this.cacheManager.del('external_bank_refresh_token');
  }

  protected async getCacheRefreshToken(): Promise<
    Record<string, any> | undefined
  > {
    const getCache = await this.cacheManager.get<string>(
      'external_bank_refresh_token',
    );
    return getCache ? JSON.parse(getCache) : undefined;
  }

  protected async cacheAccessToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'external_bank_access_token',
      JSON.stringify({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
      }),
      Math.floor(
        (new Date(token.accessTokenExpiresAt).getTime() - Date.now()) / 1000,
      ),
    );
  }

  protected async cacheRefreshToken(token: Record<string, any>): Promise<void> {
    await this.cacheManager.set(
      'external_bank_refresh_token',
      JSON.stringify({
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      }),
      Math.floor(
        (new Date(token.refreshTokenExpiresAt).getTime() - Date.now()) / 1000,
      ),
    );
  }

  protected async getAccessToken(): Promise<string> {
    let accessTokenInfo = await this.getCacheAccessToken();
    const refreshTokenInfo = await this.getCacheRefreshToken();

    if (
      (!accessTokenInfo && !refreshTokenInfo) ||
      (refreshTokenInfo &&
        new Date(refreshTokenInfo.refreshTokenExpiresAt) < new Date())
    ) {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('external_bank.auth.url') ??
            throwError(),
          {
            clientId:
              this.configService.get<string>('external_bank.auth.clientId') ??
              throwError(),
            clientSecret:
              this.configService.get<string>(
                'external_bank.auth.clientSecret',
              ) ?? throwError(),
          },
        ),
      );
      if (
        !response.data.data?.accessToken ||
        !response.data.data?.accessTokenExpiresAt
      ) {
        throw new Error('Invalid response data from authentication API');
      }

      await this.cacheAccessToken(response.data.data);
      await this.cacheRefreshToken(response.data.data);
      accessTokenInfo = response.data.data;
    }

    if (new Date(accessTokenInfo.accessTokenExpiresAt) < new Date()) {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('external_bank.auth.refreshUrl') ??
            throwError(),
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshTokenInfo.refreshToken}`,
            },
          },
        ),
      );

      if (
        !response.data.data?.accessToken ||
        !response.data.data?.accessTokenExpiresAt
      ) {
        throw new Error('Invalid response data from refresh token API');
      }

      await this.cacheAccessToken(response.data.data);
      accessTokenInfo = response.data.data;
    }

    return accessTokenInfo.accessToken;
  }
}
