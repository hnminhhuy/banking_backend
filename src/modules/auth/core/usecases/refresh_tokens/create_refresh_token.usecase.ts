import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IRefreshTokenRepo } from '../../repositories/refresh_token.irepo';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenModel,
  RefreshTokenModelParams,
} from '../../models/refresh_token.model';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../../enums/auth.provider';
import { v4 as uuidv4 } from 'uuid';
import {
  DeleteRefreshTokenUsecase,
  GetRefreshTokenUsecase,
  VerifyTokenUsecase,
} from '..';

@Injectable()
export class CreateRefreshTokenUsecase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refRepo: IRefreshTokenRepo,
    private readonly configService: ConfigService,
    private readonly getRefreshTokenUsecase: GetRefreshTokenUsecase,
    private readonly verifyTokenUsecase: VerifyTokenUsecase,
    private readonly deleteRefreshTokenUsecase: DeleteRefreshTokenUsecase,
  ) {}

  public async execute(
    userId: string,
    provider: AuthProvider,
  ): Promise<RefreshTokenModel> {
    const existingRefreshToken = await this.getRefreshTokenUsecase.execute(
      'auth_id',
      userId,
    );

    if (existingRefreshToken) {
      try {
        // Verify the token
        await this.verifyTokenUsecase.execute(
          existingRefreshToken.refreshToken,
        );

        // Token is valid, return it
        return existingRefreshToken;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          await this.deleteRefreshTokenUsecase.deleteById(
            existingRefreshToken.id,
          );
        } else {
          // Handle other token verification errors
          throw error;
        }
      }
    }

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
