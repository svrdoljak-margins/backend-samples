import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export interface ITaskCategorySummary {
  id: string;
  name: string;
  color: string | null;
}

export interface ITask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number | null;
  progress: number;
  categoryId: string | null;
  category?: ITaskCategorySummary | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
