// src/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestCorrelationId = req.headers['x-correlation-id'];
    // Récupérer ou générer un correlation ID
    let correlationId: string = '';
    if (requestCorrelationId) {
      correlationId = requestCorrelationId as string;
    } else {
      correlationId = (uuidv4 as () => string)();
    }

    // Attacher à la requête
    req['correlationId'] = correlationId;

    // Ajouter aux headers de réponse
    res.setHeader('X-Correlation-Id', correlationId);

    // Passer aux services backend
    req.headers['x-correlation-id'] = correlationId;

    next();
  }
}
