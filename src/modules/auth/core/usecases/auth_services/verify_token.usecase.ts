import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyTokenUsecase {
  constructor(private readonly jwtService: JwtService) {}
  public async execute(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Refresh token is expired');
      else if (error.name === 'JsonWebTokenError')
        throw new ForbiddenException('Refresh token is invalid type');
      throw new UnauthorizedException();
    }
  }
}
