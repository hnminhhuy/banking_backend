import { Injectable } from '@nestjs/common';
import { IOtpRepo } from '../../repositories/otp.irepo';

@Injectable()
export class GetOtpUsecase {
  constructor(private readonly otpRepo: IOtpRepo) {}

  public async execute(key: string): Promise<unknown> {
    const valueStr = await this.otpRepo.getCache(key);

    return JSON.parse(valueStr as string);
  }
}
