import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ITask } from '../interface/task.interface';

/**
 * Contract for task-related operations. Implementations must encapsulate
 * persistence details and return plain task interfaces.
 */
export abstract class AbstractTaskService {
  /** Creates a new task. */
  abstract create(dto: CreateTaskDto): Promise<ITask>;

  /** Retrieves paginated tasks matching the supplied query. */
  abstract findAll(query: TaskQueryDto): Promise<PaginationModel<ITask>>;

  /**
   * Finds a single task by id.
   * @param id - Unique identifier of the task.
   * @param includeArchived - Include soft-deleted records when true.
   */
  abstract findOne(id: string, includeArchived?: boolean): Promise<ITask>;

  /** Updates an existing task. */
  abstract update(id: string, dto: UpdateTaskDto): Promise<ITask>;

  /** Soft deletes a task. */
  abstract remove(id: string): Promise<void>;
}
