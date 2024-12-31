import { Injectable } from '@nestjs/common';
import { OtpType } from '../enums/otpType.enum';
import { OtpModel } from '../models/otp.model';
import { OtpCacheKey } from '../utils/otpCacheKey';
import { OtpGenerator } from '../utils/optGenerator';
import {
  GetOtpUsecase,
  RemoveOtpUsecase,
  SetOtpUsecase,
} from 'src/modules/redis_cache/core/usecases';
import { SendMailUseCase } from 'src/modules/mail/core/usecases/send_mail.usecase';
import { GetConfigUsecase } from 'src/modules/bank_config/core/usecase';
import { ConfigKey } from 'src/modules/bank_config/core/enum/config_key';
import { GetUserUsecase } from 'src/modules/user/core/usecases';
import { mailList } from 'src/modules/mail/core/models/mail_list';
import { UserModel } from 'src/modules/user/core/models/user.model';

@Injectable()
export class CreateOtpUsecase {
  private otpTimeout: number = 300;

  constructor(
    private readonly setOtpUsecase: SetOtpUsecase,
    private readonly getOtpUsecase: GetOtpUsecase,
    private readonly sendMailUsecase: SendMailUseCase,
    private readonly getConfigUsecase: GetConfigUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly removeOtpUsecase: RemoveOtpUsecase,
  ) {
    this.getConfigUsecase.execute(ConfigKey.OTP_TIMEOUT).then((config) => {
      this.otpTimeout = config.getValue() as number;
    });
  }

  private async sendEmail(
    otpType: OtpType,
    user: UserModel,
    otp: string,
    expiredTime: number,
  ) {
    let mailParams = undefined;
    switch (otpType) {
      case OtpType.FORGOT_PASSWORD:
        mailParams = mailList.forgotPassword;
        break;
      case OtpType.TRANSACTION:
        mailParams = mailList.transactionOtp;
        break;
    }

    await this.sendMailUsecase.execute(user.email, mailParams, {
      fullname: user.fullName,
      otp: otp,
      validityPeriod: expiredTime / 60,
    });
  }

  async execute(
    otpType: OtpType,
    userId: string,
    extraData?: Record<string, unknown>,
  ): Promise<OtpModel> {
    const user = await this.getUserUsecase.execute('id', userId);
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
    const existingOtp = (await this.getOtpUsecase.execute(key)) as OtpModel;

    if (existingOtp) {
      await this.removeOtpUsecase.execute(key);
    }

    const otp = OtpGenerator.generateOtp();
    const otpData = new OtpModel({
      userId,
      otp,
      extraData,
    });

    await this.setOtpUsecase.execute(key, otpData);
    await this.sendEmail(otpType, user, otp, this.otpTimeout);

    return otpData;
  }
}
