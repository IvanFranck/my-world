import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ServiceName } from 'src/common/config/services.config';
import type {
  SignInEmailRequest,
  SignInEmailResponse,
  SignUpEmailRequest,
  SignUpEmailResponse,
} from '@my-website/types';

@Controller('auth')
export class AuthRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: SignInEmailRequest) {
    return await this.proxy.post<SignInEmailResponse>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-in/email',
      body,
    );
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: SignUpEmailRequest) {
    return await this.proxy.post<SignUpEmailResponse>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-up/email',
      body,
      {
        timeout: 15000,
      },
    );
  }
}
