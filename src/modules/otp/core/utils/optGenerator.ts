import * as crypto from 'crypto';

export class OtpGenerator {
  public static generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
