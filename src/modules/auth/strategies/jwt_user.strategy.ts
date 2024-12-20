import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CheckCacheBlockedUserUsecase } from 'src/modules/redis_cache/core/usecases';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt_user') {
  constructor(
    configService: ConfigService,
    private readonly checkCacheBlockedUserUsecase: CheckCacheBlockedUserUsecase,
  ) {
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
    const userId = payload.authId;

    if (userId && (await this.checkCacheBlockedUserUsecase.execute(userId)))
      throw new ForbiddenException();

    return payload;
  }
}
