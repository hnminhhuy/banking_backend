import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadModel } from '../../models/refresh_token.model';

@Injectable()
export class CreateAccessTokenUsecase {
  constructor(private readonly jwtService: JwtService) {}
  public async execute(payload: PayloadModel) {
    return this.jwtService.sign(payload);
  }
}
