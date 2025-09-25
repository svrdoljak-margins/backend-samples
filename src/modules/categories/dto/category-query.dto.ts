import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationParams } from 'src/common/pagination/pagination-params';

export class CategoryQueryDto extends PaginationParams {
  @ApiPropertyOptional({ description: 'Case-insensitive search over the name' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  readonly search?: string;
}
