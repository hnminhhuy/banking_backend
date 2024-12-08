import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  RequestMethod,
} from '@nestjs/common';

export interface IRouteParams {
  path: string;
  code?: number;
  method: number;
  extraDecorators?: Array<ClassDecorator | MethodDecorator | PropertyDecorator>;
}

export function Route({
  path = '/',
  code = HttpStatus.OK,
  method = RequestMethod.GET,
  extraDecorators = [],
}: IRouteParams) {
  const methodDecorator = {
    [RequestMethod.GET]: Get,
    [RequestMethod.PUT]: Put,
    [RequestMethod.POST]: Post,
    [RequestMethod.DELETE]: Delete,
  };

  const decorators = [
    methodDecorator[method](path),
    HttpCode(code),
    ...extraDecorators,
  ];

  return applyDecorators(...decorators);
}
