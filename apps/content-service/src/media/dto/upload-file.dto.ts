import { IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  folder?: string; // articles, courses, avatars, etc.

  @IsOptional()
  @IsString()
  description?: string;
}
