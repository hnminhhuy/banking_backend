import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenModel,
  RefreshTokenModelParams,
} from '../../models/refresh_token.model';
import * as ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../../enums/auth.provider';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateRefreshTokenUsecase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refRepo: IRefreshTokenRepo,
    private readonly configService: ConfigService,
  ) {}

  public async execute(
    userId: string,
    provider: AuthProvider,
  ): Promise<RefreshTokenModel> {
    const id = uuidv4();
    const refreshToken = this.jwtService.sign(
      { id: id },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    );
    const params: RefreshTokenModelParams = {
      id: id,
      refreshToken: refreshToken,
      userId: userId,
      bankId: undefined,
      issuedAt: new Date(),
      provider: provider,
    };

    const newRefreshToken = new RefreshTokenModel(params);

    await this.refRepo.create(newRefreshToken);
    return newRefreshToken;
  }
}
