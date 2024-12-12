import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAccessTokenUsecase } from './create_access_token.usecase';
import { VerifyTokenUsecase } from './verify_token.usecase';
import { GetRefreshTokenUsecase } from '../refresh_tokens/get_refresh_token.usecase';
import { AuthProvider } from '../../enums/auth.provider';

@Injectable()
export class RefreshAccessTokenUsecase {
  constructor(
    private readonly createAccessTokenUsecase: CreateAccessTokenUsecase,
    private readonly verifyTokenUsecase: VerifyTokenUsecase,
    private readonly getRefreshTokenUsecase: GetRefreshTokenUsecase,
  ) {}

  public async execute(refreshToken: string): Promise<string> {
    //Verify refresh token
    const payload = await this.verifyTokenUsecase.execute(refreshToken);

    //Check if refresh token in DB
    const validRefreshToken = await this.getRefreshTokenUsecase.execute(
      payload.id,
    );
    if (!validRefreshToken) throw ForbiddenException;

    //Create a new access token if the refreshtoken is valid
    const accessToken = await this.createAccessTokenUsecase.execute({
      userId: validRefreshToken.userId,
      bankId: undefined,
      provider: AuthProvider.USER,
    });
    return accessToken;
  }
}
