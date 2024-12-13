import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenModel,
  RefreshTokenModelParams,
} from '../../models/refresh_token.model';
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
        expiresIn: this.configService.get<string>(
          'auth.jwtRefreshTokenExpired',
        ),
      },
    );
    const params: RefreshTokenModelParams = {
      id: id,
      refreshToken: refreshToken,
      authId: userId,
      issuedAt: new Date(),
      provider: provider,
    };

    const newRefreshToken = new RefreshTokenModel(params);

    await this.refRepo.create(newRefreshToken);
    return newRefreshToken;
  }
}
