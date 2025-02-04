import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthProvider } from '../../enums/auth.provider';
import {
  CreateAccessTokenUsecase,
  DeleteRefreshTokenUsecase,
  GetRefreshTokenUsecase,
} from '..';
import { GetUserUsecase } from 'src/modules/user/core/usecases';

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

    if (!validRefreshToken)
      throw new ForbiddenException('Refresh token is not exist!');

    const user = await this.getUserUsecase.execute(
      'id',
      validRefreshToken.authId,
    );
    if (user.isBlocked) throw new ForbiddenException('Your account is blocked');

    const accessToken = await this.createAccessTokenUsecase.execute({
      authId: validRefreshToken.authId,
      userRole: user.role,
      provider: AuthProvider.USER,
    });
    return accessToken;
  }
}
