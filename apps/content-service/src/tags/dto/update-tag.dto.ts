import { UpdateTagRequest } from '@my-website/types';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateTagDto implements UpdateTagRequest {
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'Le nom ne peut pas dépasser 30 caractères' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  slug?: string;
}
