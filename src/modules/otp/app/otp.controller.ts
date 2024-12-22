import { Controller, Get, Param } from '@nestjs/common';
import { CreateOtpUsecase, VerifyOtpUsecase } from '../core/usecases';
import { OtpType } from '../core/enums/otpType.enum';

@Controller('api/otp')
export class OtpController {
  constructor(
    private readonly createOtpUsecase: CreateOtpUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
  ) {}

  @Get('/gen')
  async test() {
    const otp = await this.createOtpUsecase.execute(
      OtpType.FORGOT_PASSWORD,
      '385d4b9a-9f6c-408f-8129-c933d4693489',
    );

    return otp;
  }

  @Get('/verify/:otp')
  async verify(@Param('otp') otp: string) {
    const result = await this.verifyOtpUsecase.execute(
      OtpType.FORGOT_PASSWORD,
      '385d4b9a-9f6c-408f-8129-c933d4693489',
      otp,
    );

    return result;
  }
}
