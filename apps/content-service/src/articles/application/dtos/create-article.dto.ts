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
import { ArticleStatusRequest, CreateArticleRequest } from '@my-website/types';

export class CreateArticleDto implements CreateArticleRequest {
  @IsString()
  @MinLength(10, { message: 'Le titre doit contenir au moins 10 caractères' })
  @MaxLength(200, { message: 'Le titre ne peut pas dépasser 200 caractères' })
  title: string;

  @IsString()
  @MinLength(100, {
    message: 'Le contenu doit contenir au moins 100 caractères',
  })
  content: string;

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

  @IsEnum(ArticleStatusRequest as object)
  status: ArticleStatusRequest;

  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  tagIds: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
