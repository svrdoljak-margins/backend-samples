import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import { IPaginationParams } from './pagination-params.interface';

export class PaginationParams implements IPaginationParams {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number.' })
  @Min(1, { message: 'Page must be at least 1.' })
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    description: 'Page size',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  @Max(50, { message: 'Limit must not exceed 50.' })
  @IsOptional()
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
