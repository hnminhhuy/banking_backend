import { Injectable, NotFoundException } from '@nestjs/common';
import { OtpType } from 'src/modules/otp/core/enums/otpType.enum';
import { CreateOtpUsecase } from 'src/modules/otp/core/usecases';
import { GetUserUsecase } from 'src/modules/user/core/usecases';

@Injectable()
export class RequestOtpResetPasswordUsecase {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly createOtpUsecase: CreateOtpUsecase,
  ) {}

  public async execute(email: string) {
    const user = await this.getUserUsecase.execute('email', email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.createOtpUsecase.execute(OtpType.FORGOT_PASSWORD, user.id, {
      userId: user.id,
      email: user.email,
    });

    return {
      userId: user.id,
      message: 'OTP sent to your email',
    };
  }
}
