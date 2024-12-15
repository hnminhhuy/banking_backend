import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefreshTokenUsecase } from './refresh_tokens/create_refresh_token.usecase';
import { CreateAccessTokenUsecase } from './auth_services/create_access_token.usecase';
import { GetRefreshTokenUsecase } from './refresh_tokens/get_refresh_token.usecase';
import { GetUserUsecase } from 'src/modules/user/core/usecases';
import { AuthProvider } from '../enums/auth.provider';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly createRefreshTokenUsecase: CreateRefreshTokenUsecase,
    private readonly createAccessTokenUsecase: CreateAccessTokenUsecase,
    private readonly getUserUsecase: GetUserUsecase,
  ) {}
  public async execute(username: string, password: string) {
    const user = await this.getUserUsecase.execute('username', username);
    if (!user) throw new NotFoundException();
    if (user.isBlocked) throw new ForbiddenException();
    if (!user.verifyPassword(password)) throw new BadRequestException();

    let refreshToken = await this.createRefreshTokenUsecase.execute(
      user.id,
      AuthProvider.USER,
    );

    const accessToken = await this.createAccessTokenUsecase.execute({
      authId: user.id,
      userRole: user.role,
      provider: AuthProvider.USER,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }
}
