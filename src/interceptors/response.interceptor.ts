import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ISuccessResponse<T> {
  data: T;
  metadata?: Record<string, unknown>;
}

interface ISuccessResponseParams<T> {
  data: T;
  metadata?: Record<string, unknown>;
}

function respond<T>(data: T | ISuccessResponseParams<T>): ISuccessResponse<T> {
  if (
    !!data &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data as unknown as object, 'metadata')
  ) {
    const { metadata, data: datum } = data as ISuccessResponseParams<T>;
    return { data: datum, metadata };
  }

  return { data: data as T };
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ISuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ISuccessResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        const formatedResponse = respond(data);
        if (
          data &&
          typeof data === 'object' &&
          Object.prototype.hasOwnProperty.call(data, 'statusCode')
        ) {
          const { statusCode } = data as { statusCode: number };
          response.status(statusCode);
        } else {
          // Set a default HTTP status code, e.g., 200
          response.status(200);
        }

        return formatedResponse;
      }),
    );
  }
}
