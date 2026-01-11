// src/articles/application/dto/article-filters.dto.ts
import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleStatusRequest, ArticleFiltersRequest } from '@my-website/types';

export class ArticleFiltersDto implements ArticleFiltersRequest {
  @IsOptional()
  @IsEnum(ArticleStatusRequest as object)
  status?: ArticleStatusRequest;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @IsOptional()
  @IsUUID('4')
  tagId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID('4')
  authorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['publishedAt', 'createdAt', 'views'])
  sortBy?: 'publishedAt' | 'createdAt' | 'views' = 'publishedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
