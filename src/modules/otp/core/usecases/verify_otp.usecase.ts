import { BadRequestException, Injectable } from '@nestjs/common';
import { GetOtpUsecase } from 'src/modules/redis_cache/core/usecases';
import { OtpType } from '../enums/otpType.enum';
import { OtpCacheKey } from '../utils/otpCacheKey';
import { VerifyOtp } from '../utils/otpValidators';
import { OtpModel } from '../models/otp.model';

@Injectable()
export class VerifyOtpUsecase {
  constructor(private readonly getOtpUsecase: GetOtpUsecase) {}

  async execute(
    otpType: OtpType,
    userId: string,
    otp: string,
    extraData?: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      const key = OtpCacheKey.generate(userId, otpType);
      const cacheOtp = (await this.getOtpUsecase.execute(key)) as OtpModel;

      if (!cacheOtp) {
        throw new BadRequestException('Invalid OTP');
      }

      const verifier = new VerifyOtp();
      verifier.setOtpType(otpType);

      const result = verifier.verifyOtp(cacheOtp, otp, extraData);

      if (!result) {
        throw new BadRequestException('Invalid OTP or expired');
      }

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
