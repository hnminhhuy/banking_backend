import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResponseInterceptor } from 'src/interceptors';

export const configAppInterceptor = (app: INestApplication): void => {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );
};
