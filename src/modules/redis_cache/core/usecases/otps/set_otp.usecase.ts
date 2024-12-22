import { Injectable } from '@nestjs/common';
import { IOtpRepo } from '../../repositories/otp.irepo';

@Injectable()
export class SetOtpUsecase {
  constructor(private readonly otpRepo: IOtpRepo) {}

  public async execute(key: string, value: unknown): Promise<void> {
    const valueStr = JSON.stringify(value);
    await this.otpRepo.setCache(key, valueStr);
  }
}
