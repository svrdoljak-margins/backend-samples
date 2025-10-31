import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'Short, action-oriented title', maxLength: 160 })
  @IsString({ message: 'Title must be a string.' })
  @MinLength(3, { message: 'Title must contain at least 3 characters.' })
  @MaxLength(160, { message: 'Title must not exceed 160 characters.' })
  readonly title!: string;

  @ApiPropertyOptional({ description: 'Detailed description of the task' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  readonly description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.Backlog })
  @IsEnum(TaskStatus, {
    message: 'Status must be a valid task status.',
  })
  @IsOptional()
  readonly status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.Medium })
  @IsEnum(TaskPriority, {
    message: 'Priority must be a valid task priority.',
  })
  @IsOptional()
  readonly priority?: TaskPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsISO8601(undefined, {
    message: 'Start date must be a valid ISO 8601 date string.',
  })
  @IsOptional()
  readonly startDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsISO8601(undefined, {
    message: 'Due date must be a valid ISO 8601 date string.',
  })
  @IsOptional()
  readonly dueDate?: string;

  @ApiPropertyOptional({ description: 'Estimated effort in hours', example: 6 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: 'Estimated hours must be a number with up to 2 decimal places.',
  })
  @IsPositive({ message: 'Estimated hours must be greater than 0.' })
  @IsOptional()
  @Max(1000, {
    message: 'Estimated hours must not exceed 1000.',
  })
  readonly estimatedHours?: number;

  @ApiPropertyOptional({
    description: 'Actual effort spent in hours',
    example: 4,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: 'Actual hours must be a number with up to 2 decimal places.',
  })
  @IsPositive({ message: 'Actual hours must be greater than 0.' })
  @IsOptional()
  @Max(1000, { message: 'Actual hours must not exceed 1000.' })
  readonly actualHours?: number;

  @ApiPropertyOptional({ description: 'Completion percentage', example: 50 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Progress must be a number.' })
  @Min(0, { message: 'Progress must be at least 0.' })
  @Max(100, { message: 'Progress must not exceed 100.' })
  @IsOptional()
  readonly progress?: number;

  @ApiPropertyOptional({ format: 'uuid', description: 'Category identifier' })
  @IsUUID('4', { message: 'Category id must be a valid UUID.' })
  @IsOptional()
  readonly categoryId?: string;
}
