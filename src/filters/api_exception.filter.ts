import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException, IBaseExceptionResponse } from 'src/exceptions';
import { ERROR_CODES } from '../common/utils/constants';
import { isDevelopmentEnv } from 'src/common/helpers/env.helper';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Response<IBaseExceptionResponse> {
    console.log(exception);
    const response = host.switchToHttp()?.getResponse<Response>();
    if (!response) {
      console.error('No HTTP response context found');
      throw new Error('No HTTP response context found');
    }

    if (isDevelopmentEnv) {
      console.log(exception);
    }

    let data = <IBaseExceptionResponse>{
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong!',
    };

    try {
      const status =
        exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

      if (exception instanceof BaseException) {
        const { code, message } = exception;

        data = {
          code,
          status,
          message,
        };
      } else {
        const { name, message } = exception;

        switch (name) {
          case 'ForbiddenException': {
            data = {
              code: ERROR_CODES.FORBIDDEN_ACCESS,
              status,
              message: 'You are unauthorized to use this resource.',
            };

            break;
          }
          case 'UnauthorizedException': {
            data = {
              code: ERROR_CODES.UNAUTHORIZED_ACCESS,
              status,
              message: 'You are unauthorized.',
            };

            break;
          }

          case 'BadRequestException': {
            data = {
              code: ERROR_CODES.BAD_REQUEST,
              status,
              message,
            };

            break;
          }

          case 'NotFoundException': {
            data = {
              code: ERROR_CODES.RESOURCE_NOT_FOUND,
              status,
              message: 'The resource can not be found.',
            };

            break;
          }
          default: {
            console.log(exception);

            break;
          }
        }
      }

      return response.status(status).send(data);
    } catch (error) {
      if (isDevelopmentEnv) {
        data.stack = error?.stack;
        data.message = error?.message;
      }

      console.error(error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(data);
    }
  }
}
