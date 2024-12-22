import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetOAuthTokenUsecase } from '../../../core/usecases/login_bank.usecase';
import { OAuthTokenDto } from '../../dtos/auth.dto';
import { Route } from '../../../../../decorators';
import authRoute from '../../routes/auth.route';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { AuthGuard } from '@nestjs/passport';
import { CreateAccessTokenUsecase } from '../../../core/usecases';
import { AuthProvider } from '../../../core/enums/auth.provider';

@Controller()
@ApiTags('Public')
export class AuthController {
  constructor(
    private readonly getOAuthTokenUsecase: GetOAuthTokenUsecase,
    private readonly configService: ConfigService,
    private readonly createAccessTokenUsecase: CreateAccessTokenUsecase,
  ) {}

  @Route(authRoute.oauthToken)
  async oauthToken(@Body() body: OAuthTokenDto) {
    const bearerToken = await this.getOAuthTokenUsecase.execute(
      body.clientId,
      body.clientSecret,
    );

    const accessTokenExpiresIn = await this.configService.get<string>(
      'auth.jwt.signOptions.expiresIn',
    );
    const accessTokenExpiresInMs = ms(accessTokenExpiresIn);
    const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresInMs);

    const refreshTokenExpiresIn = await this.configService.get<string>(
      'auth.jwtRefreshTokenExpired',
    );
    const refreshTokenExpiresInMs = ms(refreshTokenExpiresIn);
    const refreshTokenExpiresAt = new Date(
      Date.now() + refreshTokenExpiresInMs,
    );

    return {
      ...bearerToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
    };
  }

  @Route(authRoute.refreshOAuthToken)
  @UseGuards(AuthGuard('jwt_bank'))
  @ApiBearerAuth()
  async refreshOAuthToken(@Req() req: any) {
    const newAccessToken = await this.createAccessTokenUsecase.execute({
      authId: req.user.id,
      provider: AuthProvider.BANK,
    });

    const accessTokenExpiresIn = await this.configService.get<string>(
      'auth.jwt.signOptions.expiresIn',
    );
    const accessTokenExpiresInMs = ms(accessTokenExpiresIn);
    const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresInMs);

    return {
      accessToken: newAccessToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
    };
  }
}
