import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  RequestMethod,
  UseGuards,
} from '@nestjs/common';
import { ISwaggerParams, SwaggerApi } from './swagger.decorator';
import { UserRole } from 'src/modules/user/core/enums/user_role';
import { UserRoles } from 'src/modules/auth/core/decorators/role.decorator';
import { RoleAuthGuard } from 'src/modules/auth/core/guards/role_auth.guard';

export interface IRouteParams {
  path: string;
  method: number;
  code?: number;
  secure?: boolean;
  roles?: UserRole[];
  swaggerParams?: ISwaggerParams;
  extraDecorators?: Array<ClassDecorator | MethodDecorator | PropertyDecorator>;
}

export function Route({
  path = '/',
  method = RequestMethod.GET,
  code = HttpStatus.OK,
  secure = false,
  roles = [],
  swaggerParams = {},
  extraDecorators = [],
}: IRouteParams) {
  const methodDecorator = {
    [RequestMethod.GET]: Get,
    [RequestMethod.PUT]: Put,
    [RequestMethod.POST]: Post,
    [RequestMethod.DELETE]: Delete,
    [RequestMethod.PATCH]: Patch,
  };

  const decorators = [
    methodDecorator[method](path),
    HttpCode(code),
    SwaggerApi({ secure: secure, ...swaggerParams }),
    ...extraDecorators,
  ];

  if (roles.length > 0) {
    decorators.push(UserRoles(...roles));
  }

  if (secure) {
    decorators.push(UseGuards(RoleAuthGuard));
  }
  return applyDecorators(...decorators);
}
