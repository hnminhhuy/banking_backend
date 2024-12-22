import { Injectable } from '@nestjs/common';
import { OtpType } from '../enums/otpType.enum';
import { OtpModel } from '../models/otp.model';
import { OtpCacheKey } from '../utils/otpCacheKey';
import { OtpGenerator } from '../utils/optGenerator';
import {
  GetOtpUsecase,
  SetOtpUsecase,
} from 'src/modules/redis_cache/core/usecases';
import { SendMailUseCase } from 'src/modules/mail/core/usecases/send_mail.usecase';

@Injectable()
export class CreateOtpUsecase {
  constructor(
    private readonly setOtpUsecase: SetOtpUsecase,
    private readonly getOtpUsecase: GetOtpUsecase,
    private readonly sendMailUsecase: SendMailUseCase,
  ) {}

  async execute(
    otpType: OtpType,
    userId: string,
    extraData?: Record<string, unknown>,
  ): Promise<OtpModel> {
    const key = OtpCacheKey.generate(userId, otpType);
    const existingOtp = (await this.getOtpUsecase.execute(key)) as OtpModel;
    const otp = existingOtp ? existingOtp.otp : OtpGenerator.generateOtp();
    const otpData = new OtpModel({
      userId,
      otp,
      extraData,
    });

    await this.setOtpUsecase.execute(key, otpData);
    // await this.sendMailUsecase.execute();

    return otpData;
  }
}
