/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AUTH_ROUTES_PATHS, IS_PUBLIC_KEY } from 'src/libs/constants';
import type { Request } from 'express';
import { ProxyService } from 'src/proxy/proxy.service';
import { BETTER_AUTH_SESSION_TOKEN_NAME } from '@my-website/constants';
import { ServiceName } from '../config/services.config';
import { GetSessionResponse } from '@my-website/types';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly proxyService: ProxyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // try first the jwt token on header
    const token = this.extractTokenFromHeader(request);
    if (token) {
      this.logger.log('Token validation from header');
      return this.validateJwtToken(token, request);
    }

    // if token isn't in header, try with cookies
    const sessionCookie = this.extractSessionCookie(request);
    if (sessionCookie) {
      return this.validateSessionCookie(sessionCookie, request);
    }

    return true;
  }

  /**
   * Validate jwt token
   */
  private async validateJwtToken(token: string, request: Request) {
    try {
      this.logger.log(`token to validate: ${token}`);

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
      this.logger.log(`payload: ${JSON.stringify(payload)}`);

      // Attach user info to the request
      request['user'] = {
        id: payload.sub,
        email: payload.email,
      };

      // Attach headers for backend services
      request.headers['x-user-id'] = payload.sub;
      request.headers['x-user-email'] = payload.email;

      this.logger.log(`User ${payload.sub} authenticated`);

      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`JWT validation failed: ${err}`);
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }

  /**
   * Valider un cookie de session BetterAuth
   */
  private async validateSessionCookie(
    sessionToken: string,
    request: Request,
  ): Promise<boolean> {
    try {
      // Appeler Auth Service pour valider la session
      const session = await this.proxyService.get<GetSessionResponse>(
        ServiceName.AUTH_SERVICE,
        AUTH_ROUTES_PATHS.GET_USER_SESSION,
        {
          headers: {
            cookie: `${BETTER_AUTH_SESSION_TOKEN_NAME}=${sessionToken}`,
          },
        },
      );

      const sessionData = session.data;

      if (!sessionData.user) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attacher les infos user à la requête
      request['user'] = {
        id: sessionData.user.id,
        email: sessionData.user.email,
      };

      // Headers pour les services backend
      request.headers['x-user-id'] = sessionData.user.id;
      request.headers['x-user-email'] = sessionData.user.email;

      this.logger.debug(
        `User ${sessionData.user.id} authenticated via session cookie`,
      );

      return true;
    } catch (error) {
      this.logger.error(`Session validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid session');
    }
  }

  /**
   * Extract the token from the header
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' && token ? token : undefined;
  }

  /**
   * Extract the betterauth session cookie
   */
  private extractSessionCookie(request: Request): string | undefined {
    const sessionName = BETTER_AUTH_SESSION_TOKEN_NAME as string;
    return (request.cookies as { [sessionName]?: string } | undefined)?.[
      sessionName
    ];
  }
}
