import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUsecase } from '../../core/usecases/login.usecase';
import { LoginDto } from '../dtos/auth.dto';
import { RefreshAccessTokenUsecase } from '../../core/usecases/auth_services/refresh_access_token_usecase';
import { RoleAuthGuard } from '../../core/guards/auth.guard';

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

  @ApiBearerAuth()
  @UseGuards(RoleAuthGuard)
  @Post('/refresh')
  @ApiBody({
    description: 'Thông tin của người dùng mới',
    schema: {
      example: {
        refreshToken: 'string',
      },
    },
  })
  async refresh(@Body() body: { refreshToken: string }) {
    const newAccessToken = await this.refreshAccessTokenUsecase.execute(
      body.refreshToken,
    );

    return { accessToken: newAccessToken }; // Send the new access token in response
  }
}
