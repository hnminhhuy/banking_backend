import { forwardRef, Module } from '@nestjs/common';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';
import { CreateOtpUsecase, VerifyOtpUsecase } from './core/usecases';
import { MailModule } from '../mail/mail.module';
import { OtpController } from './app/otp.controller';

@Module({
  imports: [forwardRef(() => RedisCacheModule), forwardRef(() => MailModule)],
  providers: [CreateOtpUsecase, VerifyOtpUsecase],
  controllers: [OtpController],
  exports: [],
})
export class OtpModule {}
