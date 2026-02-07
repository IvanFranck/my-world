import { USER_ID_HEADER } from '@my-website/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { ArticleFiltersDto } from 'src/articles/application/dtos/article-filters.dto';
import { CreateArticleDto } from 'src/articles/application/dtos/create-article.dto';
import { UpdateArticleDto } from 'src/articles/application/dtos/update-article.dto';
import { ArticleService } from 'src/articles/application/services/article.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateArticleDto,
    @Req() req: Request,
    @Headers(USER_ID_HEADER as string) userId: string,
  ) {
    console.log('🚀 ~ ArticlesController ~ create ~ req:', req.headers);
    console.log('🚀 ~ ArticlesController ~ create ~ userId:', userId);
    return await this.articleService.create(dto, userId);
  }

  @Get()
  async findAll(@Query() filters: ArticleFiltersDto) {
    return await this.articleService.findAll(filters);
  }

  @Get('popular')
  async findPopular(@Query('limit') limit?: number) {
    return await this.articleService.findPopular(limit);
  }

  @Get('recent')
  async findRecent(@Query('limit') limit?: number) {
    return await this.articleService.findRecent(limit);
  }

  @Get(':slug')
  async findByslug(@Param('slug') slug: string) {
    return await this.articleService.findBySlug(slug);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return await this.articleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return await this.articleService.delete(id);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return await this.articleService.publish(id);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return await this.articleService.archive(id);
  }
}
