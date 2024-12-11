import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadModel } from '../../models/refresh_token.model';

@Injectable()
export class VerifyTokenUsecase {
  constructor(private readonly jwtService: JwtService) {}
  public async execute(token: string) {
    return await this.jwtService.verify(token);
  }
}
