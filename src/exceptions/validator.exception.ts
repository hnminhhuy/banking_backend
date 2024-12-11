import { ValidationError } from 'class-validator';
import { BaseException, IBaseExceptionResponse } from './base.exception';
import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from 'src/common/utils/constants';

interface IBaseValidatorException extends Partial<IBaseExceptionResponse> {
  errors: ValidationError[];
}

export class ValidatorException extends BaseException {
  protected errors: ValidationError[];

  constructor({
    errors = [],
    message = 'Unprocessable Entity',
    status = HttpStatus.UNPROCESSABLE_ENTITY,
    code = ERROR_CODES.VALIDATION_ERROR,
  }: IBaseValidatorException) {
    super({ message, status, code });
    this.errors = errors;
  }
}
