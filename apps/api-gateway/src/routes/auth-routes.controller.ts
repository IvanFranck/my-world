import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ServiceName } from 'src/common/config/services.config';

@Controller('auth')
export class AuthRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown) {
    return await this.proxy.post<unknown>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-up/email',
      body,
    );
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: unknown) {
    return await this.proxy.post<unknown>(
      ServiceName.AUTH_SERVICE,
      '/api/auth/sign-up/email',
      body,
    );
  }
}
