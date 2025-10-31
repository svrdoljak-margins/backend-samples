import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationParams } from 'src/common/pagination/pagination-params';

export class CategoryQueryDto extends PaginationParams {
  @ApiPropertyOptional({ description: 'Case-insensitive search over the name' })
  @IsOptional()
  @IsString({ message: 'Search must be a string.' })
  @MaxLength(80, {
    message: 'Search must not exceed 80 characters.',
  })
  readonly search?: string;
}
