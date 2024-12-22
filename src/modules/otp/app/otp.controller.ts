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
      OtpType.TRANSACTION,
      '6e64af45-acaf-4d3b-bf7e-5dd046a186f6',
    );

    return otp;
  }

  @Get('/verify/:otp')
  async verify(@Param('otp') otp: string) {
    const result = await this.verifyOtpUsecase.execute(
      OtpType.TRANSACTION,
      '6e64af45-acaf-4d3b-bf7e-5dd046a186f6',
      otp,
    );

    return result;
  }
}
