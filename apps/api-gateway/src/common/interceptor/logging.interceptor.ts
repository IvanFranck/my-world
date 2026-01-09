import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interceptor qui log les détails de chaque requête/réponse
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request =
      ctx.getRequest<Request<unknown, unknown, unknown, unknown>>();
    const response = ctx.getResponse<Response>();

    const { method, url, body, ip } = request;
    const correlationId =
      (request['correlationId'] as string | undefined) || 'unknown';
    const user = request['user'] as { id: string } | undefined;

    // Timestamp de début
    const startTime = Date.now();

    // Log de la requête entrante
    this.logger.log(
      `[${correlationId}] Incoming: ${method} ${url} - User: ${user?.id || 'anonymous'} - IP: ${ip}`,
    );

    // Log du body en développement (attention aux données sensibles !)
    if (process.env.NODE_ENV === 'development' && method !== 'GET') {
      this.logger.debug(
        `[${correlationId}] Request body: ${JSON.stringify(this.sanitizeBody(body))}`,
      );
    }

    // Intercepter la réponse
    return next.handle().pipe(
      tap({
        next: (data) => {
          // Calculer la durée
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log de la réponse
          this.logger.log(
            `[${correlationId}] Completed: ${method} ${url} - ${statusCode} - ${duration}ms`,
          );

          // Log du résultat en développement
          if (process.env.NODE_ENV === 'development') {
            const responseSize = JSON.stringify(data).length;
            this.logger.debug(
              `[${correlationId}] Response size: ${responseSize} bytes`,
            );
          }
        },
        error: (error: Error) => {
          // Log en cas d'erreur
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${correlationId}] Failed: ${method} ${url} - ${error.message} - ${duration}ms`,
          );
        },
      }),
    );
  }

  /**
   * Sanitize le body pour éviter de logger des données sensibles
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
      'creditCard',
    ];

    const sanitized = { ...body } as Record<string, unknown>;

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
