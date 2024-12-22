import { OtpType } from '../enums/otpType.enum';

export class OtpCacheKey {
  public static generate(userId: string, otpType: OtpType): string {
    return `${otpType}:${userId}`;
  }
}
