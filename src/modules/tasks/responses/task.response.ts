import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskEntity } from '../entities/task.entity';
import { TaskCategorySummaryResponse } from './task-category-summary.response';

export class TaskResponse {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiPropertyOptional()
  readonly description?: string | null;

  @ApiProperty({ enum: TaskStatus })
  readonly status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  readonly priority: TaskPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  readonly startDate?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  readonly dueDate?: string | null;

  @ApiPropertyOptional({ description: 'Estimated effort in hours', example: 6 })
  readonly estimatedHours?: number | null;

  @ApiPropertyOptional({
    description: 'Actual effort spent in hours',
    example: 4,
  })
  readonly actualHours?: number | null;

  @ApiProperty({ description: 'Progress in percentage', example: 50 })
  readonly progress: number;

  @ApiPropertyOptional({ type: TaskCategorySummaryResponse })
  readonly category?: TaskCategorySummaryResponse | null;

  @ApiProperty({ type: String })
  readonly createdAt: string;

  @ApiProperty({ type: String })
  readonly updatedAt: string;

  constructor(task: TaskEntity) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description ?? null;
    this.status = task.status;
    this.priority = task.priority;
    this.startDate = task.startDate ? task.startDate.toISOString() : null;
    this.dueDate = task.dueDate ? task.dueDate.toISOString() : null;
    this.estimatedHours = task.estimatedHours ?? null;
    this.actualHours = task.actualHours ?? null;
    this.progress = task.progress;
    this.category = task.category
      ? new TaskCategorySummaryResponse(task.category)
      : null;
    this.createdAt = task.createdAt.toISOString();
    this.updatedAt = task.updatedAt.toISOString();
  }
}
