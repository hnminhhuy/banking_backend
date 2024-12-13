import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send an OTP email' })
  @ApiBody({
    description: 'Details for sending the email',
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', example: 'recipient@example.com' },
        subject: { type: 'string', example: 'Your OTP Code' },
        text: { type: 'string', example: 'Here is your OTP: 123456' },
        html: {
          type: 'string',
          example: '<p>Here is your OTP: <b>123456</b></p>',
        },
      },
    },
  })
  async sendOtpEmail(
    @Body() body: { to: string; subject: string; text: string; html: string },
  ) {
    return await this.otpService.sendMail(
      body.to,
      body.subject,
      body.text,
      body.html,
    );
  }
}
