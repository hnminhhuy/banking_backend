import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google, GoogleApis } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly REDIRECT_URI: string;
  private readonly REFRESH_TOKEN: string;

  private oAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.CLIENT_ID = this.configService.get<string>('otp.clientId');
    this.CLIENT_SECRET = this.configService.get<string>('otp.clientSecret');
    this.REDIRECT_URI = this.configService.get<string>('otp.redirectUri');
    this.REFRESH_TOKEN = this.configService.get<string>('otp.refreshToken');
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    try {
      this.oAuth2Client = new google.auth.OAuth2(
        this.CLIENT_ID,
        this.CLIENT_SECRET,
        this.REDIRECT_URI,
      );

      this.oAuth2Client.setCredentials({ refresh_token: this.REFRESH_TOKEN });
      const accessToken = await this.oAuth2Client.getAccessToken();

      console.log(accessToken);
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'nkhy.dev@gmail.com',
          clientId: this.CLIENT_ID,
          clientSecret: this.CLIENT_SECRET,
          refreshToken: this.REFRESH_TOKEN,
          accessToken: accessToken.token as string,
        },
      });

      const mailOptions = {
        from: `SENDER NAME>`,
        to,
        subject,
        text,
        html,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
