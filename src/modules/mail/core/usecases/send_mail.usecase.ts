import { Injectable } from '@nestjs/common';
import { ForgotPasswordData } from '../models/forgot_password_data.model';
import { GetInitialPasswordData } from '../models/get_initial_password_data.model';
import { MailService } from '../../infra/mail.service';
import { SEND_MAIL_TYPE } from '../enums/send_mail_type';
import { MAIL_SUBJECT } from '../enums/subject';


@Injectable()
export class SendMailUseCase {
  constructor(private readonly mailService: MailService) {}

  async execute(
    to: string,
    sendMailType: SEND_MAIL_TYPE,
    data: ForgotPasswordData | GetInitialPasswordData
  ): Promise<boolean> {
    let subject = '';
    let templateName = '';

    switch (sendMailType) {
      case SEND_MAIL_TYPE.OTP_FORGOT_PASSWORD:
        subject = MAIL_SUBJECT.OTP_FORGOT_PASSWORD;
        templateName = 'forgot_password';
        break;
      case SEND_MAIL_TYPE.MAIL_GET_INITIAL_PASSWORD:
        subject = MAIL_SUBJECT.MAIL_GET_INITIAL_PASSWORD;
        templateName = 'get_initial_password';
        break;
      default:
        throw new Error('Invalid sendMailType');
    }

    const htmlContent = await this.mailService.renderTemplate(templateName, data);

    return this.mailService.sendMail(to, subject, htmlContent);
  }
}
