import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ServiceName } from 'src/common/config/services.config';
import type {
  SignInEmailRequest,
  SignInEmailResponse,
  SignUpEmailRequest,
  SignUpEmailResponse,
} from '@my-website/types';
import type { Response } from 'express';

@Controller('auth')
export class AuthRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: SignInEmailRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.proxy.post<SignInEmailResponse>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-in/email',
      body,
    );

    if (result.cookies) {
      res.setHeader('Set-Cookie', result.cookies);
    }

    return result.data;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() body: SignUpEmailRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.proxy.post<SignUpEmailResponse>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-up/email',
      body,
      {
        timeout: 15000,
      },
    );

    if (result.cookies) {
      res.setHeader('Set-Cookie', result.cookies);
    }

    return result.data;
  }
}
