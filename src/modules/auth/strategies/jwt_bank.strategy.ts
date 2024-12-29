import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtBankStrategy extends PassportStrategy(Strategy, 'jwt_bank') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      algorithms: [configService.get<string>('auth.jwt.signOptions.algorithm')],
      secretOrKey: configService.get<string>('auth.jwt.publicKey'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
