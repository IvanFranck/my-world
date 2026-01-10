import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtre global qui capture TOUTES les exceptions
 * (HttpException, erreurs système, etc.)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Récupérer le correlation ID
    const correlationId =
      (request['correlationId'] as string | undefined) || 'unknown';

    // Déterminer le status HTTP et le message
    let status: number;
    let message: string | object;
    let errorName: string;

    if (exception instanceof HttpException) {
      // Exception HTTP standard (400, 401, 404, etc.)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse;

      errorName = exception.name;
    } else if (exception instanceof Error) {
      // Erreur JavaScript standard (TypeError, ReferenceError, etc.)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      errorName = exception.name;

      // Log la stack trace pour les erreurs système
      this.logger.error(
        `[${correlationId}] System error: ${exception.message}`,
        exception.stack,
      );
    } else {
      // Erreur inconnue
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorName = 'UnknownError';

      this.logger.error(
        `[${correlationId}] Unknown error:`,
        JSON.stringify(exception),
      );
    }

    // Construire la réponse d'erreur standardisée
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
      error: errorName,
      message: this.extractMessage(message),
    };

    // Log l'erreur
    this.logger.error(
      `[${correlationId}] ${request.method} ${request.url} - ${status} ${errorName}`,
    );

    // En développement, ajouter plus de détails
    if (process.env.NODE_ENV === 'development') {
      errorResponse['details'] = message;
      if (exception instanceof Error) {
        errorResponse['stack'] = exception.stack;
      }
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Extraire le message d'erreur principal
   */
  private extractMessage(message: string | object): string | string[] {
    if (typeof message === 'string') {
      return message;
    }

    // Si c'est un objet avec un champ message
    if (message['message']) {
      return message['message'] as string;
    }

    return 'An error occurred';
  }
}
