import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenModel,
  RefreshTokenModelParams,
} from '../../models/refresh_token.model';
import * as ms from 'ms';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateRefreshTokenUsecase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refRepo: IRefreshTokenRepo,
    private readonly configService: ConfigService,
  ) {}

  public async execute(
    params: RefreshTokenModelParams,
  ): Promise<RefreshTokenModel> {
    const expiresIn = await this.configService.get<string>(
      'auth.refreshTokenExpiresIn',
    );
    const expiresInMs = ms(expiresIn);

    params['issuedAt'] = new Date();
    params['expiredAt'] = new Date(Date.now() + expiresInMs);

    const newRefreshToken = new RefreshTokenModel(params);
    newRefreshToken.refreshToken = this.jwtService.sign(
      { id: newRefreshToken.id },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    );
    await this.refRepo.create(newRefreshToken);
    return newRefreshToken;
  }
}
