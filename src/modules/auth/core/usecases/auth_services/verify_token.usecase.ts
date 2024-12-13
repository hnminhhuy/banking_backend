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
      if (error.name === 'TokenExpiredError') throw UnauthorizedException;
      else if (error.name === 'JsonWebTokenError') throw ForbiddenException;
      throw UnauthorizedException;
    }
  }
}
