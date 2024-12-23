import { OtpType } from '../enums/otpType.enum';
import { OtpModel } from '../models/otp.model';

abstract class VerifyOtpStrategy {
  abstract verifyOtp(
    cacheOtp: OtpModel,
    otp: string,
    extraData?: Record<string, unknown>,
  ): boolean;
}

export class VerifyOtp {
  private otpType: OtpType;
  private verifyOtpStrategy: VerifyOtpStrategy;

  public setOtpType(otpType: OtpType): void {
    this.otpType = otpType;
    switch (this.otpType) {
      case OtpType.TRANSACTION:
        this.verifyOtpStrategy = new VerifyTransactionOtp();
        break;
      case OtpType.FORGOT_PASSWORD:
        this.verifyOtpStrategy = new VerifyForgotPasswordOtp();
        break;
      default:
        throw new Error('Invalid otp type');
    }
  }

  verifyOtp(
    cacheOtp: OtpModel,
    otp: string,
    extraData?: Record<string, unknown>,
  ): boolean {
    return this.verifyOtpStrategy.verifyOtp(cacheOtp, otp, extraData);
  }
}

class VerifyTransactionOtp implements VerifyOtpStrategy {
  verifyOtp(
    cacheOtp: OtpModel,
    otp: string,
    extraData?: Record<string, unknown>,
  ): boolean {
    if (cacheOtp.otp !== otp) return false;
    if (cacheOtp.extraData?.transactionId !== extraData?.transactionId)
      return false;

    return true;
  }
}

class VerifyForgotPasswordOtp implements VerifyOtpStrategy {
  verifyOtp(
    cacheOtp: OtpModel,
    otp: string,
    extraData?: Record<string, unknown>,
  ): boolean {
    if (cacheOtp.otp !== otp) return false;

    return true;
  }
}
