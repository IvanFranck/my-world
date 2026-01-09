import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Interceptor qui ajoute un timeout global aux requêtes
 * Si une requête prend plus de X ms, elle est annulée
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  // Timeout par défaut : 30 secondes
  private readonly timeout =
    parseInt(process.env.REQUEST_TIMEOUT || '5000', 10) || 30000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId =
      (request['correlationId'] as string | undefined) || 'unknown';

    return next.handle().pipe(
      timeout(this.timeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.error(
            `[${correlationId}] Request timeout after ${this.timeout}ms`,
          );
          return throwError(
            () =>
              new RequestTimeoutException(
                `Request timeout after ${this.timeout}ms`,
              ),
          );
        }
        return throwError(() => err as Error);
      }),
    );
  }
}
