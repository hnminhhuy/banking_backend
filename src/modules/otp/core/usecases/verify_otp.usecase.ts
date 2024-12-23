import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GetOtpUsecase,
  RemoveOtpUsecase,
} from 'src/modules/redis_cache/core/usecases';
import { OtpType } from '../enums/otpType.enum';
import { OtpCacheKey } from '../utils/otpCacheKey';
import { VerifyOtp } from '../utils/otpValidators';
import { OtpModel } from '../models/otp.model';

@Injectable()
export class VerifyOtpUsecase {
  constructor(
    private readonly getOtpUsecase: GetOtpUsecase,
    private readonly removeOptUsecase: RemoveOtpUsecase,
  ) {}

  async execute(
    otpType: OtpType,
    userId: string,
    otp: string,
    extraData?: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      let key: string = '';
      switch (otpType) {
        case OtpType.FORGOT_PASSWORD:
          key = OtpCacheKey.generate(otpType, [userId]);
          break;
        case OtpType.TRANSACTION:
          key = OtpCacheKey.generate(otpType, [
            userId,
            extraData?.transactionId as string,
          ]);
      }

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

      await this.removeOptUsecase.execute(key);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
