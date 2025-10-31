import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Display name for the category', maxLength: 80 })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must contain at least 2 characters.' })
  @MaxLength(80, { message: 'Name must not exceed 80 characters.' })
  readonly name!: string;

  @ApiPropertyOptional({ description: 'Detailed description', maxLength: 500 })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters.',
  })
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Hex color code used for UI labelling',
    example: '#4F46E5',
  })
  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color (e.g., #4F46E5).' })
  readonly color?: string;
}
