import { MailSubject } from '../enums/subject';
import { MailParams } from './mail_params';

export const mailList = {
  forgotPassword: <MailParams>{
    subject: MailSubject.OTP_FORGOT_PASSWORD,
    templateName: 'forgot_password',
  },
  getInitPassword: <MailParams>{
    subject: MailSubject.MAIL_GET_INITIAL_PASSWORD,
    templateName: 'get_initial_password',
  },
  transactionOtp: <MailParams>{
    subject: MailSubject.TRANSACTION_OTP,
    templateName: 'transaction_otp',
  },
};
