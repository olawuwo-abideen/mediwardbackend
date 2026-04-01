import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts and transforms the HTTP response.
   * @param context The execution context.
   * @param next The call handler.
   * @returns An observable containing the transformed response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const getResponse = context.switchToHttp().getResponse<Response>();

        if (
          getResponse.statusCode === 201 &&
          context.switchToHttp().getRequest().method === 'POST'
        ) {
          getResponse.status(200); 
        }

        return {
          status: true,
          code: getResponse.statusCode,
          ...data, 
        };
      }),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }
}