import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ServiceName } from 'src/common/config/services.config';
import type {
  GetSessionResponse,
  SignInEmailRequest,
  SignInEmailResponse,
  SignOutResponse,
  SignUpEmailRequest,
  SignUpEmailResponse,
} from '@my-website/types';
import type { Request, Response } from 'express';
import { BETTER_AUTH_SESSION_TOKEN_NAME } from '@my-website/constants';
import { AUTH_ROUTES_PATHS } from 'src/libs/constants';

@Controller('auth')
export class AuthRoutesController {
  private readonly logger = new Logger(AuthRoutesController.name);

  constructor(private readonly proxy: ProxyService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: SignInEmailRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInEmailResponse> {
    const result = await this.proxy.post<SignInEmailResponse>(
      ServiceName.AUTH_SERVICE,
      AUTH_ROUTES_PATHS.LOGIN,
      body,
    );

    if (result.cookies) {
      result.cookies.forEach((cookie) => {
        res.setHeader('Set-Cookie', cookie);
      });
    }

    return result.data;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() body: SignUpEmailRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignUpEmailResponse> {
    const result = await this.proxy.post<SignUpEmailResponse>(
      ServiceName.AUTH_SERVICE,
      AUTH_ROUTES_PATHS.SIGNUP,
      body,
    );

    if (result.cookies) {
      result.cookies.forEach((cookie) => {
        res.setHeader('Set-Cookie', cookie);
      });
    }

    return result.data;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignOutResponse> {
    const result = await this.proxy.post<SignOutResponse>(
      ServiceName.AUTH_SERVICE,
      AUTH_ROUTES_PATHS.LOGOUT,
    );

    res.clearCookie(BETTER_AUTH_SESSION_TOKEN_NAME as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return result.data;
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  async getUserSesion(@Req() req: Request): Promise<GetSessionResponse> {
    const cookieHeader = req.headers.cookie;

    const result = await this.proxy.get<GetSessionResponse>(
      ServiceName.AUTH_SERVICE,
      AUTH_ROUTES_PATHS.GET_USER_SESSION,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      },
    );

    return result.data;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getUserInfos(@Req() req: Request): Promise<GetSessionResponse> {
    const cookieHeader = req.headers.cookie;

    const result = await this.proxy.get<GetSessionResponse>(
      ServiceName.AUTH_SERVICE,
      AUTH_ROUTES_PATHS.GET_ACCOUNT_INFOS,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      },
    );

    return result.data;
  }
}
