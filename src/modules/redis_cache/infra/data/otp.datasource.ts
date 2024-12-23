import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigKey } from 'src/modules/bank_config/core/enum/config_key';
import { GetConfigUsecase } from 'src/modules/bank_config/core/usecase';

@Injectable()
export class OtpDatasource {
  private otpTimeout: number = 120;

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    private readonly getConfigUsecase: GetConfigUsecase,
  ) {
    this.getConfigUsecase.execute(ConfigKey.OTP_TIMEOUT).then((config) => {
      this.otpTimeout = config.getValue() as number;
    });
  }

  public async setOtp(key: string, valueStr: string): Promise<void> {
    await this.redisClient.set(key, valueStr, 'EX', this.otpTimeout);
  }

  public async getOtp(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  public async removeOtp(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
