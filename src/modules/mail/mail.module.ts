import { Module } from '@nestjs/common';
import { MailService } from './infra/mail.service';
import { SendMailUseCase } from './core/usecases/send_mail.usecase';
import { MailController } from './test.controller';

@Module({
  controllers: [MailController],
  providers: [MailService, SendMailUseCase],
})
export class MailModule {}
