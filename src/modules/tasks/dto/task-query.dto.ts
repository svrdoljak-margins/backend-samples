import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => String(item));
  })
  @IsEnum(TaskStatus, {
    each: true,
    message: 'Each status filter must be a valid task status.',
  })
  @IsOptional()
  readonly status?: TaskStatus[] | TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, isArray: true })
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => String(item));
  })
  @IsEnum(TaskPriority, {
    each: true,
    message: 'Each priority filter must be a valid task priority.',
  })
  @IsOptional()
  readonly priority?: TaskPriority[] | TaskPriority;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsUUID('4', { message: 'Category id must be a valid UUID.' })
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks starting from this date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601(undefined, {
    message: 'dueDateFrom must be a valid ISO 8601 date string.',
  })
  @IsOptional()
  readonly dueDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks due before this date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601(undefined, {
    message: 'dueDateTo must be a valid ISO 8601 date string.',
  })
  @IsOptional()
  readonly dueDateTo?: string;

  @ApiPropertyOptional({
    description: 'Full-text search over title and description',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string.' })
  readonly search?: string;

  @ApiPropertyOptional({ enum: TaskSortField, default: TaskSortField.DUE_DATE })
  @IsEnum(TaskSortField, {
    message: 'Sort field must be one of the supported task sort options.',
  })
  @IsOptional()
  readonly sortBy?: TaskSortField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsIn(['asc', 'desc'], {
    message: "Sort direction must be either 'asc' or 'desc'.",
  })
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
