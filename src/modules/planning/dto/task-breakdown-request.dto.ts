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
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  summary!: string;

  @ApiPropertyOptional({
    description:
      'Additional context such as business goals, stakeholders, or constraints',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  context?: string;

  @ApiPropertyOptional({
    description:
      'Key constraints that must be respected (resources, budget, tools, etc.)',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  constraints?: string[];

  @ApiPropertyOptional({
    description:
      'Preferred categories for subtasks to help inform the LLM response',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Existing subtasks to avoid duplicates',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  existingSubtasks?: string[];

  @ApiPropertyOptional({
    description: 'Desired number of subtasks',
    minimum: 3,
    maximum: 20,
    default: 8,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(3)
  @Max(20)
  @IsOptional()
  preferredSubtaskCount?: number;

  @ApiPropertyOptional({
    description: 'Target completion date',
    type: String,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Total estimated effort in hours',
    example: 40,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(1000)
  @IsOptional()
  estimatedEffortHours?: number;
}
