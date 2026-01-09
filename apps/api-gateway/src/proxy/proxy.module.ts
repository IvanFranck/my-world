import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './http-client.service';
import { RetryService } from './retry.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  providers: [ProxyService, RetryService, HttpClientService],
})
export class ProxyModule {}
