import { USER_ID_HEADER } from '@my-website/constants';
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@my-website/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { type Request } from 'express';
import { SERVICE_CONFIG, ServiceName } from 'src/common/config/services.config';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
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
    @CurrentUserId() userId: string,
  ) {
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
  @Public()
  async findAll(
    @Query() query: Record<string, string | undefined>,
    @CurrentUserId() userId: string,
  ) {
    const filters = buildUrlQuery(query);

    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}?${filters}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Get(':slug')
  @Public()
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/${slug}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Get('recent')
  @Public()
  async getRecents(
    @CurrentUserId() userId: string,
    @Query('limit') limit?: string,
  ) {
    const query = buildUrlQuery({ limit });
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/recent?${query}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Get('popular')
  @Public()
  async getPopulars(
    @CurrentUserId() userId: string,
    @Query('limit') limit?: string,
  ) {
    const query = buildUrlQuery({ limit });
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/popular?${query}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleRequest,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.patch(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/${id}`,
      dto,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string, @CurrentUserId() userId: string) {
    return await this.proxy.patch(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/${id}/publish`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string, @CurrentUserId() userId: string) {
    return await this.proxy.patch(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/${id}/archive`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUserId() userId: string) {
    return await this.proxy.delete(
      ServiceName.CONTENT_SERVICE,
      `${CONTENT_ROUTES_PATHS.ARTICLES.ROOT}/${id}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }
}
