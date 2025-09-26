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
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  readonly name!: string;

  @ApiPropertyOptional({ description: 'Detailed description', maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Hex color code used for UI labelling',
    example: '#4F46E5',
  })
  @IsHexColor()
  @IsOptional()
  readonly color?: string;
}
