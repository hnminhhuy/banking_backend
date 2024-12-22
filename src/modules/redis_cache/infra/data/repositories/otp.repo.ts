import { IOtpRepo as IOtpRepo } from 'src/modules/redis_cache/core/repositories/otp.irepo';
import { OtpDatasource } from '../otp.datasource';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepo implements IOtpRepo {
  constructor(private readonly optDatasource: OtpDatasource) {}

  public async setCache(key: string, valueStr: string): Promise<void> {
    this.optDatasource.setOtp(key, valueStr);
  }
  public getCache(key: string): Promise<unknown> {
    return this.optDatasource.getOtp(key);
  }
}
