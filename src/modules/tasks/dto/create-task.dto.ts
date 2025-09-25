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
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  readonly title!: string;

  @ApiPropertyOptional({ description: 'Detailed description of the task' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.Backlog })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.Medium })
  @IsEnum(TaskPriority)
  @IsOptional()
  readonly priority?: TaskPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsISO8601()
  @IsOptional()
  readonly startDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsISO8601()
  @IsOptional()
  readonly dueDate?: string;

  @ApiPropertyOptional({ description: 'Estimated effort in hours', example: 6 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  @Max(1000)
  readonly estimatedHours?: number;

  @ApiPropertyOptional({
    description: 'Actual effort spent in hours',
    example: 4,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  @Max(1000)
  readonly actualHours?: number;

  @ApiPropertyOptional({ description: 'Completion percentage', example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly progress?: number;

  @ApiPropertyOptional({ format: 'uuid', description: 'Category identifier' })
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;
}
