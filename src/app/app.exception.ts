import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidatorException } from 'src/exceptions';
import { ApiExceptionFilter } from 'src/filters';
import { ValidatorExceptionFilter } from 'src/filters/validator_exception.filter';

export const configAppException = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidatorException({ errors: validationErrors });
      },
    }),
  );

  app.useGlobalFilters(
    new ApiExceptionFilter(),
    new ValidatorExceptionFilter(),
  );
};
