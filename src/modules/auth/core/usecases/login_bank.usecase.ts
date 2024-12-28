import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetBankUsecase } from '../../../bank/core/usecases';
import { CreateAccessTokenUsecase } from './auth_services/create_access_token.usecase';
import * as cryptoJs from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { CreateRefreshTokenUsecase } from './refresh_tokens/create_refresh_token.usecase';
import { AuthProvider } from '../enums/auth.provider';

@Injectable()
export class GetOAuthTokenUsecase {
  constructor(
    private readonly getBankUsecase: GetBankUsecase,
    private readonly createAccessTokenUsecase: CreateAccessTokenUsecase,
    private readonly createRefreshTokenUsecase: CreateRefreshTokenUsecase,
    private readonly configService: ConfigService,
  ) {}

  public async execute(clientId: string, clientSecret: string) {
    const isValid = this.validateClient(clientId, clientSecret);

    if (!isValid) {
      throw new UnauthorizedException('Invalid client');
    }

    const bank = await this.getBankUsecase.execute('id', clientId);

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    const refreshToken = await this.createRefreshTokenUsecase.execute(
      clientId,
      AuthProvider.BANK,
    );

    const accessToken = await this.createAccessTokenUsecase.execute({
      authId: clientId,
      provider: AuthProvider.USER,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  private validateClient(clientId: string, clientSecret: string): boolean {
    const clientIdHashed = cryptoJs
      .HmacSHA512(clientId, this.configService.get<string>('auth.hashKey'))
      .toString();
    return clientIdHashed == clientSecret;
  }
}
