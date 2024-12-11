import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from 'src/common/utils/constants';

export interface IBaseExceptionResponse {
  code: number;
  status: number;
  message: string;
  stack?: string;
}

export class BaseException extends HttpException {
  public code: number;

  constructor({
    code = ERROR_CODES.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  }: IBaseExceptionResponse) {
    super(message, status);
    this.code = code;
  }
}
