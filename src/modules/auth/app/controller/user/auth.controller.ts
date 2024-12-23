import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Route } from '../../../../../decorators';
import {
  LoginUsecase,
  RefreshAccessTokenUsecase,
  RequestOtpResetPasswordUsecase,
  GenerateResetPasswordTokenUsecase,
  ResetPasswordUsecase,
} from '../../../core/usecases';
import { OtpDto } from '../../dtos/otp.dto';
import { RequestResetPasswordDto } from '../../dtos/request_reset_password.dto';
import { ResetPasswordDto } from '../../dtos/reset_password.dto';
import authRoute from '../../routes/auth.route';

@ApiTags('Public')
@Controller({ path: 'api/auth/v1' })
export class AuthController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly refreshAccessTokenUsecase: RefreshAccessTokenUsecase,
    private readonly requestOtpResetPassword: RequestOtpResetPasswordUsecase,
    private readonly generateResetPasswordToken: GenerateResetPasswordTokenUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
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
    return { accessToken: newAccessToken };
  }

  @Route(authRoute.requestPasswordReset)
  async requestChangePassword(@Body() body: RequestResetPasswordDto) {
    return await this.requestOtpResetPassword.execute(body.email);
  }

  @Route(authRoute.verifyOtp)
  async verifyOtp(@Body() body: OtpDto) {
    const resetToken = await this.generateResetPasswordToken.execute(
      body.userId,
      body.otp,
    );

    return {
      resetToken: resetToken,
    };
  }

  @Route(authRoute.resetPassword)
  async resetPassword(@Body() body: ResetPasswordDto, @Req() req) {
    return await this.resetPasswordUsecase.execute(
      req.user.authId,
      body.newPassword,
      body.confirmPassword,
    );
  }
}
