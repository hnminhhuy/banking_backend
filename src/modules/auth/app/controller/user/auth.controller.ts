import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  LoginUsecase,
  RefreshAccessTokenUsecase,
} from '../../../core/usecases';
import { Route } from 'src/decorators';
import authRoute from '../../routes/auth.route';

@ApiTags('Public')
@Controller({ path: 'api/auth/v1' })
export class AuthController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly refreshAccessTokenUsecase: RefreshAccessTokenUsecase,
  ) {}

  @Route(authRoute.login)
  async login(@Body() body: LoginDto) {
    const bearerToken = await this.loginUsecase.execute(
      body.username,
      body.password,
    );

    return bearerToken;
  }

  @Route(authRoute.refreshAccessToken)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt_user'))
  async refresh(@Req() req) {
    const newAccessToken = await this.refreshAccessTokenUsecase.execute(
      req.user.id,
    );
    return { accessToken: newAccessToken }; // Send the new access token in response
  }

  //Authorization
  // @Get()
  // @UserRoles(UserRole.Admin) or @UserRoles(Roles.Admin, Roles.Manager)
  // @UseGuards(RoleAuthGuard)
}
