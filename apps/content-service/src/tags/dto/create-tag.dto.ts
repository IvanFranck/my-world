import { CreateTagRequest } from '@my-website/types';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTagDto implements CreateTagRequest {
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(30, { message: 'Le nom ne peut pas dépasser 30 caractères' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  slug?: string;
}
