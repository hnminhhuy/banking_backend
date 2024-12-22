import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpType } from 'src/modules/otp/core/enums/otpType.enum';
import { VerifyOtpUsecase } from 'src/modules/otp/core/usecases';

@Injectable()
export class GenerateResetPasswordTokenUsecase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
  ) {}

  public async execute(userId: string, otp: string): Promise<string> {
    const isValid = await this.verifyOtpUsecase.execute(
      OtpType.FORGOT_PASSWORD,
      userId,
      otp,
    );

    if (!isValid) throw new Error('Invalid OTP');

    // Generate a JWT token for reset password session
    const payload = {
      authId: userId,
      action: 'reset_password',
    };

    return this.jwtService.sign(payload, {
      expiresIn: '10m',
    });
  }
}
