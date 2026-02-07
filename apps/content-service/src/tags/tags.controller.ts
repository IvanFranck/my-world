import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.tagsService.findAllWithArticleCount();
  }

  @Get('search')
  async search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.tagsService.search(query, limit);
  }

  @Get('popular')
  async findPopular(@Query('limit') limit?: number) {
    return this.tagsService.findPopular(limit);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.tagsService.findBySlug(slug);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.tagsService.delete(id);
  }
}
