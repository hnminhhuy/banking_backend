import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SEND_MAIL_TYPE } from './core/enums/send_mail_type';
import { ForgotPasswordData } from './core/models/forgot_password_data.model';
import { GetInitialPasswordData } from './core/models/get_initial_password_data.model';
import { SendMailUseCase } from './core/usecases/send_mail.usecase';


@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly sendMailUseCase: SendMailUseCase) {}

  @Post('otp-forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for forgot password' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiBody({
    description: 'Forgot Password OTP request data',
    examples: {
      example1: {
        summary: 'Example OTP request',
        value: {
          fullName: 'John Doe',
          otp: '123456',
          text: 'Your OTP for password reset is: 123456',
        },
      },
    },
  })
  async sendOtpForgotPassword(@Body() body: ForgotPasswordData): Promise<string> {
    const { fullName, otp, text } = body;

    if (!fullName || !otp || !text) {
      throw new Error('Missing required fields');
    }

    try {
      await this.sendMailUseCase.execute(
        "nkhy21@clc.fitus.edu.vn",
        SEND_MAIL_TYPE.OTP_FORGOT_PASSWORD,
        body
      );
      return 'OTP for Forgot Password sent successfully';
    } catch (error) {
      throw new Error('Error sending OTP email');
    }
  }

  @Post('get-initial-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send initial password to user' })
  @ApiResponse({ status: 200, description: 'Initial password sent successfully' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiBody({
    description: 'Initial Password request data',
    examples: {
      example1: {
        summary: 'Example initial password request',
        value: {
          fullName: 'John Doe',
          initialPassword: 'Initial1234',
        },
      },
    },
  })
  async sendGetInitialPassword(@Body() body: GetInitialPasswordData): Promise<string> {
    const { fullName, initialPassword } = body;

    if (!fullName || !initialPassword) {
      throw new Error('Missing required fields');
    }

    try {
      await this.sendMailUseCase.execute(
        "nkhy21@clc.fitus.edu.vn",
        SEND_MAIL_TYPE.MAIL_GET_INITIAL_PASSWORD,
        body
      );
      return 'Initial Password sent successfully';
    } catch (error) {
      throw new Error('Error sending Initial Password email');
    }
  }
}
