import { RequestMethod } from '@nestjs/common';
import { IRouteParams } from 'src/decorators';
import { UserRole } from 'src/modules/user/core/enums/user_role';

export default {
  createCustomer: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    secure: true,
    roles: [UserRole.Employee],
    swaggerParams: {},
  },
};
