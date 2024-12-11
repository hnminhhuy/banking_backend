import { Body, Controller, Injectable, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUsecase } from '../../core/usecases/login.usecase';
import { LoginDto } from '../dtos/auth.dto';

@ApiTags('Public')
@Controller({ path: 'api/user/v1' })
export class AuthController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const bearerToken = await this.loginUsecase.execute(
      body.username,
      body.password,
    );

    return bearerToken;
  }
}
