import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOAuthTokenUsecase } from '../../../core/usecases/login_bank.usecase';
import { OAuthTokenDto } from '../../dtos/auth.dto';
import { Route } from '../../../../../decorators';
import authRoute from '../../routes/auth.route';

@Controller()
@ApiTags('Public')
export class AuthController {
  constructor(private readonly getOAuthTokenUsecase: GetOAuthTokenUsecase) {}

  @Route(authRoute.oauthToken)
  async oauthToken(@Body() body: OAuthTokenDto) {
    const bearerToken = await this.getOAuthTokenUsecase.execute(
      body.clientId,
      body.clientSecret,
    );

    return bearerToken;
  }

  async refreshOAuthToken() {}
}
