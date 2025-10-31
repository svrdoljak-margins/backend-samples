import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class TaskBreakdownRequestDto {
  @ApiProperty({ description: 'High-level description of the task to plan' })
  @IsString({ message: 'Summary must be a string.' })
  @MinLength(5, { message: 'Summary must contain at least 5 characters.' })
  @MaxLength(500, { message: 'Summary must not exceed 500 characters.' })
  summary!: string;

  @ApiPropertyOptional({
    description:
      'Additional context such as business goals, stakeholders, or constraints',
  })
  @IsOptional()
  @IsString({ message: 'Context must be a string.' })
  @MaxLength(2000, {
    message: 'Context must not exceed 2000 characters.',
  })
  context?: string;

  @ApiPropertyOptional({
    description:
      'Key constraints that must be respected (resources, budget, tools, etc.)',
    type: [String],
  })
  @IsArray({ message: 'Constraints must be an array.' })
  @IsString({ each: true, message: 'Each constraint must be a string.' })
  @ArrayMaxSize(10, {
    message: 'Constraints must not contain more than 10 items.',
  })
  @IsOptional()
  constraints?: string[];

  @ApiPropertyOptional({
    description:
      'Preferred categories for subtasks to help inform the LLM response',
    type: [String],
  })
  @IsArray({ message: 'Categories must be an array.' })
  @IsString({ each: true, message: 'Each category must be a string.' })
  @ArrayMaxSize(10, {
    message: 'Categories must not contain more than 10 items.',
  })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Existing subtasks to avoid duplicates',
    type: [String],
  })
  @IsArray({ message: 'Existing subtasks must be an array.' })
  @IsString({ each: true, message: 'Each existing subtask must be a string.' })
  @ArrayMaxSize(20, {
    message: 'Existing subtasks must not contain more than 20 items.',
  })
  @IsOptional()
  existingSubtasks?: string[];

  @ApiPropertyOptional({
    description: 'Desired number of subtasks',
    minimum: 3,
    maximum: 20,
    default: 8,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Preferred subtask count must be a number.' })
  @Min(3, { message: 'Preferred subtask count must be at least 3.' })
  @Max(20, {
    message: 'Preferred subtask count must not exceed 20.',
  })
  @IsOptional()
  preferredSubtaskCount?: number;

  @ApiPropertyOptional({
    description: 'Target completion date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601(undefined, {
    message: 'Due date must be a valid ISO 8601 date string.',
  })
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Total estimated effort in hours',
    example: 40,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 }, {
    message:
      'Estimated effort hours must be a number with up to 1 decimal place.',
  })
  @Min(1, { message: 'Estimated effort hours must be at least 1.' })
  @Max(1000, { message: 'Estimated effort hours must not exceed 1000.' })
  @IsOptional()
  estimatedEffortHours?: number;
}
