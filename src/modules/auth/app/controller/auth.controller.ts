import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUsecase } from '../../core/usecases/login.usecase';
import { LoginDto } from '../dtos/auth.dto';
import { RefreshAccessTokenUsecase } from '../../core/usecases/auth_services/refresh_access_token.usecase';

import { AuthGuard } from '@nestjs/passport';

@ApiTags('Public')
@Controller({ path: 'api/user/v1' })
export class AuthController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly refreshAccessTokenUsecase: RefreshAccessTokenUsecase,
  ) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const bearerToken = await this.loginUsecase.execute(
      body.username,
      body.password,
    );

    return bearerToken;
  }

  @Post('/refresh')
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
  // @UserRoles(UserRoles.Admin) or @UserRoles(Roles.Admin, Roles.Manager)
  // @UseGuards(RoleAuthGuard)
}
