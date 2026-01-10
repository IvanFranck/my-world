import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtre spécifique pour les HttpException
 * Plus détaillé que le AllExceptionsFilter
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const correlationId =
      (request['correlationId'] as string | undefined) || 'unknown';

    // Récupérer la réponse de l'exception
    const exceptionResponse = exception.getResponse();

    // Construire le message d'erreur
    let errorMessage: string | string[];
    let errorDetails: any;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      errorMessage =
        (exceptionResponse['message'] as string | undefined) ||
        exception.message;
      errorDetails = exceptionResponse;
    } else {
      errorMessage = '';
    }

    // Construire la réponse standardisée
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
      message: errorMessage,
    };

    // Ajouter les détails en développement
    if (process.env.NODE_ENV === 'development' && errorDetails) {
      errorResponse['details'] = errorDetails as unknown;
    }

    // Log selon la sévérité
    if (status >= 500) {
      // Erreurs serveur → ERROR
      this.logger.error(
        `[${correlationId}] ${request.method} ${request.url} - ${status}`,
        exception.stack,
      );
    } else if (status >= 400) {
      // Erreurs client → WARN
      this.logger.warn(
        `[${correlationId}] ${request.method} ${request.url} - ${status} - ${errorMessage}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
