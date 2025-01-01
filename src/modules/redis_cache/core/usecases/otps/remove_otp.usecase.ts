import { Injectable } from '@nestjs/common';
import { IOtpRepo } from '../../repositories/otp.irepo';

@Injectable()
export class RemoveOtpUsecase {
  constructor(private readonly optRepo: IOtpRepo) {}

  public async execute(key: string) {
    await this.optRepo.removeCache(key);
  }
}
