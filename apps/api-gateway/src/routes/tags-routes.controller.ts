import { USER_ID_HEADER } from '@my-website/constants';
import type { CreateTagRequest, UpdateTagRequest } from '@my-website/types';
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
import { SERVICE_CONFIG, ServiceName } from 'src/common/config/services.config';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { TAG_ROUTE_PATHS } from 'src/libs/constants';
import { buildUrlQuery } from 'src/libs/utils';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller('tags')
export class TagsRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() dto: CreateTagRequest,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.post(
      ServiceName.CONTENT_SERVICE,
      TAG_ROUTE_PATHS.ROOT,
      dto,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Public()
  @Get()
  async findAll(@CurrentUserId() userId: string) {
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      TAG_ROUTE_PATHS.ROOT,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Public()
  @Get('search')
  async search(
    @CurrentUserId() userId: string,
    @Query('q') search: string,
    @Query('limit') limit?: string,
  ) {
    const query = buildUrlQuery({
      q: search,
      limit,
    });
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${TAG_ROUTE_PATHS.SEARCH}?${query}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Public()
  @Get('popular')
  async popular(
    @CurrentUserId() userId: string,
    @Query('limit') limit?: string,
  ) {
    const query = buildUrlQuery({
      limit,
    });
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${TAG_ROUTE_PATHS.POPULAR}?${query}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Public()
  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${TAG_ROUTE_PATHS.SLUG.replace(':slug', slug)}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagRequest,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.patch(
      ServiceName.CONTENT_SERVICE,
      `${TAG_ROUTE_PATHS.ID.replace(':id', id)}`,
      dto,
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
      `${TAG_ROUTE_PATHS.ID.replace(':id', id)}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }
}
