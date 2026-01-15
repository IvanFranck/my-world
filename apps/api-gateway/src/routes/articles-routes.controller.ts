import { USER_ID_HEADER } from '@my-website/constants';
import type { CreateArticleRequest } from '@my-website/types';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { SERVICE_CONFIG, ServiceName } from 'src/common/config/services.config';
import { CONTENT_ROUTES_PATHS } from 'src/libs/constants';
import { buildUrlQuery } from 'src/libs/utils';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller('articles')
export class ArticlesRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Body() dto: CreateArticleRequest,
    @Req() request: Request,
  ) {
    const userId = request.headers[USER_ID_HEADER as string] as string;
    return await this.proxy.post(
      ServiceName.CONTENT_SERVICE,
      CONTENT_ROUTES_PATHS.ARTICLES.ROOT,
      dto,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }
  @Get()
  async findAll(
    @Query() query: Record<string, string | undefined>,
    @Req() request: Request,
  ) {
    const filters = buildUrlQuery(query);
    const userId = request.headers[USER_ID_HEADER as string] as string;

    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}?${filters}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }
}
