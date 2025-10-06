import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { ITask } from '../interface/task.interface';
import {
  TaskCategorySummaryResponse,
  mapTaskCategoryToResponse,
} from './task-category-summary.response';

export class TaskResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiProperty({ enum: TaskStatus })
  status!: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  priority!: TaskPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  startDate?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  dueDate?: string | null;

  @ApiPropertyOptional({ description: 'Estimated effort in hours', example: 6 })
  estimatedHours?: number | null;

  @ApiPropertyOptional({
    description: 'Actual effort spent in hours',
    example: 4,
  })
  actualHours?: number | null;

  @ApiProperty({ description: 'Progress in percentage', example: 50 })
  progress!: number;

  @ApiPropertyOptional({ type: TaskCategorySummaryResponse })
  category?: TaskCategorySummaryResponse | null;

  @ApiProperty({ type: String })
  createdAt!: string;

  @ApiProperty({ type: String })
  updatedAt!: string;
}

export const mapTaskToResponse = (task: ITask): TaskResponse => ({
  id: task.id,
  title: task.title,
  description: task.description ?? null,
  status: task.status,
  priority: task.priority,
  startDate: task.startDate ? task.startDate.toISOString() : null,
  dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  estimatedHours: task.estimatedHours ?? null,
  actualHours: task.actualHours ?? null,
  progress: task.progress,
  category: task.category ? mapTaskCategoryToResponse(task.category) : null,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});
