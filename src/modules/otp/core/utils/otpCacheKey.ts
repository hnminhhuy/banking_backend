import { OtpType } from '../enums/otpType.enum';

export class OtpCacheKey {
  public static generate(otpType: OtpType, params: string[]) {
    if (!params || params.length === 0) {
      throw new Error('Params must contain at least one element.');
    }
    // Join all parameters into a single string
    const paramsPart = params.join(':');
    return `${otpType}:${paramsPart}`;
  }
}
