import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CaptchaService {
  constructor(private readonly httpService: HttpService) {}

  async verifyCaptcha(captchaToken: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://www.google.com/recaptcha/api/siteverify',
          null,
          {
            params: {
              secret: secretKey,
              response: captchaToken,
            },
          },
        ),
      );
      const { success } = response.data;
      return success;
    } catch (error) {
      throw new Error('Error verifying CATCHA');
    }
  }
}
