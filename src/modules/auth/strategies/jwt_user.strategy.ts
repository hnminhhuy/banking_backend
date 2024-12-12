import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { request } from 'http';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt_user') {
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
