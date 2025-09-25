import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { PaginationParams } from 'src/common/pagination/pagination-params';

import { TaskPriority } from '../enums/task-priority.enum';
import { TaskSortField } from '../enums/task-sort-field.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskQueryDto extends PaginationParams {
  @ApiPropertyOptional({ enum: TaskStatus, isArray: true })
  @IsEnum(TaskStatus, { each: true })
  @IsOptional()
  @Type(() => String)
  readonly status?: TaskStatus[] | TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, isArray: true })
  @IsEnum(TaskPriority, { each: true })
  @IsOptional()
  @Type(() => String)
  readonly priority?: TaskPriority[] | TaskPriority;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks starting from this date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  readonly dueDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks due before this date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  readonly dueDateTo?: string;

  @ApiPropertyOptional({
    description: 'Full-text search over title and description',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiPropertyOptional({ enum: TaskSortField, default: TaskSortField.DueDate })
  @IsEnum(TaskSortField)
  @IsOptional()
  readonly sortBy?: TaskSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  readonly sortDirection?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Include tasks that have been soft deleted',
    default: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  readonly includeArchived?: boolean;
}
