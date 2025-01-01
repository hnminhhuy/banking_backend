import { Body, Controller, Param, Req } from '@nestjs/common';
import { CreateFcmTokenUsecase } from '../../core/usecases/fcm_token/create_fcm_token.usecase';
import { DeleteFcmTokenUsecase } from '../../core/usecases/fcm_token/delete_fcm_token.usecase';
import { Route } from '../../../../decorators';
import { FcmRoute } from '../routes/fcm.route';
import { FcmTokenDto } from '../dto/fcm_token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`FCM Token`)
@Controller({ path: 'api/v1/fcm' })
export class FcmController {
  constructor(
    private readonly createFcmTokenUsecase: CreateFcmTokenUsecase,
    private readonly deleteFcmTokenUsecase: DeleteFcmTokenUsecase,
  ) {}

  @Route(FcmRoute.createFcmToken)
  async createFcmToken(@Req() req: any, @Body() body: FcmTokenDto) {
    try {
      const fcm = await this.createFcmTokenUsecase.execute({
        token: body.token,
        userId: req.user.authId,
      });
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  @Route(FcmRoute.deleteFcmToken)
  async deleteFcmToken(@Req() req: any, @Param() param: FcmTokenDto) {
    await this.deleteFcmTokenUsecase.execute(req.user.authId, param.token);
    return true;
  }
}
