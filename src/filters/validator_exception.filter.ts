import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { IBaseExceptionResponse, ValidatorException } from 'src/exceptions';
import type { Response } from 'express';
import { ERROR_CODES } from 'src/common/utils/constants';

export interface IValidatorExceptionResponse extends IBaseExceptionResponse {
  detail?: Record<string, string[]>;
}

@Catch(ValidatorException)
export class ValidatorExceptionFilter implements ExceptionFilter {
  catch(
    exception: ValidatorException,
    host: ArgumentsHost,
  ): Response<IBaseExceptionResponse> {
    const response = host.switchToHttp().getResponse<Response>();

    try {
      const { errors } = exception as unknown as {
        errors: ValidationError[];
      };
      // const firstMessage = errors[0];
      // const dto = firstMessage.target.constructor.name;

      const detail = errors?.reduce((result, { property, constraints }) => {
        result[property] = Object.values(constraints);

        return result;
      }, {});

      const firstError = Object.values(
        Object.values(detail || {})?.[0] || [] || {},
      );

      const resBody = <IValidatorExceptionResponse>{
        code: ERROR_CODES.BAD_REQUEST,
        status: HttpStatus.BAD_REQUEST,
        message: firstError?.[0] || 'Invalid Information',
      };

      return response.status(422).send(resBody);
    } catch (error) {
      const resBody = <IBaseExceptionResponse>{
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
      };

      console.error(error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(resBody);
    }
  }
}
