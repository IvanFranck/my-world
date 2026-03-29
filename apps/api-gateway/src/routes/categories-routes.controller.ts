import { USER_ID_HEADER } from '@my-website/constants';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
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
} from '@nestjs/common';
import { SERVICE_CONFIG, ServiceName } from 'src/common/config/services.config';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CATEGORY_ROUTE_PATHS } from 'src/libs/constants';
import { ProxyService } from 'src/proxy/proxy.service';

@Public()
@Controller('categories')
export class CategoriesRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() dto: CreateCategoryRequest,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.post(
      ServiceName.CONTENT_SERVICE,
      CATEGORY_ROUTE_PATHS.ROOT,
      dto,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUserId() userId: string) {
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      CATEGORY_ROUTE_PATHS.ROOT,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.get(
      ServiceName.CONTENT_SERVICE,
      `${CATEGORY_ROUTE_PATHS.SLUG.replace(':slug', slug)}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequest,
    @CurrentUserId() userId: string,
  ) {
    return await this.proxy.patch(
      ServiceName.CONTENT_SERVICE,
      `${CATEGORY_ROUTE_PATHS.ID.replace(':id', id)}`,
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
      `${CATEGORY_ROUTE_PATHS.ID.replace(':id', id)}`,
      {
        timeout: SERVICE_CONFIG[ServiceName.CONTENT_SERVICE].timeout,
        headers: userId ? { [USER_ID_HEADER]: userId } : {},
      },
    );
  }
}
