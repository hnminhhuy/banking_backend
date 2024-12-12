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
} from '@nestjs/common';
import { ISwaggerParams, SwaggerApi } from './swagger.decorator';

export interface IRouteParams {
  path: string;
  code?: number;
  method: number;
  secure?: boolean;
  swaggerParams?: ISwaggerParams;
  extraDecorators?: Array<ClassDecorator | MethodDecorator | PropertyDecorator>;
}

export function Route({
  path = '/',
  code = HttpStatus.OK,
  method = RequestMethod.GET,
  secure = false,
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

  return applyDecorators(...decorators);
}
