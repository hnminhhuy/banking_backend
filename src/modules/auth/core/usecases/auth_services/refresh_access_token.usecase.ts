import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAccessTokenUsecase } from './create_access_token.usecase';
import { VerifyTokenUsecase } from './verify_token.usecase';
import { GetRefreshTokenUsecase } from '../refresh_tokens/get_refresh_token.usecase';
import { AuthProvider } from '../../enums/auth.provider';
import { GetUserUsecase } from 'src/modules/user/core/usecases';
import { DeleteRefreshTokenUsecase } from '../refresh_tokens/delete_refresh_token.usecase';

@Injectable()
export class RefreshAccessTokenUsecase {
  constructor(
    private readonly createAccessTokenUsecase: CreateAccessTokenUsecase,
    private readonly deleteRefreshTokenUsecase: DeleteRefreshTokenUsecase,
    private readonly getRefreshTokenUsecase: GetRefreshTokenUsecase,
    private readonly getUserUsecase: GetUserUsecase,
  ) {}

  public async execute(id: string): Promise<string> {
    //Check if refresh token in DB
    const validRefreshToken = await this.getRefreshTokenUsecase.execute(
      'id',
      id,
    );
    if (!validRefreshToken) throw ForbiddenException;
    const user = await this.getUserUsecase.execute(
      'id',
      validRefreshToken.authId,
    );
    if (!user.isActive) {
      this.deleteRefreshTokenUsecase.deleteById(id);
      throw ForbiddenException;
    }

    //Create a new access token if the refreshtoken is valid
    const accessToken = await this.createAccessTokenUsecase.execute({
      authId: validRefreshToken.authId,
      userRole: user.role,
      provider: AuthProvider.USER,
    });
    return accessToken;
  }
}
