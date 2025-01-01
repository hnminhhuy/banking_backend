import { forwardRef, Module } from '@nestjs/common';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';
import { CreateOtpUsecase, VerifyOtpUsecase } from './core/usecases';
import { MailModule } from '../mail/mail.module';
import { BankConfigModule } from '../bank_config/bank_config.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => RedisCacheModule),
    forwardRef(() => MailModule),
    forwardRef(() => BankConfigModule),
    forwardRef(() => UserModule),
  ],
  providers: [CreateOtpUsecase, VerifyOtpUsecase],
  controllers: [],
  exports: [CreateOtpUsecase, VerifyOtpUsecase],
})
export class OtpModule {}
