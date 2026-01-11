import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  IsDateString,
  IsUrl,
} from 'class-validator';
import { ArticleStatusRequest, UpdateArticleRequest } from '@my-website/types';

export class UpdateArticleDto implements UpdateArticleRequest {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(100)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  slug?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @IsOptional()
  @IsEnum(ArticleStatusRequest as object)
  status?: ArticleStatusRequest;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
