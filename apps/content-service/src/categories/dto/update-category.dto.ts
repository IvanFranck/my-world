import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'La couleur doit être au format hexadécimal (#RRGGBB)',
  })
  color?: string;
}
