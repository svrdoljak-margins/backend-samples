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
  /**
   * Creates a new task record.
   * @param dto - Task payload describing the entity to create.
   * @returns The persisted task DTO.
   */
  abstract create(dto: CreateTaskDto): Promise<ITask>;

  /**
   * Retrieves tasks using pagination options.
   * @param query - Pagination and filtering criteria.
   * @returns Paginated task DTOs.
   */
  abstract findAll(query: TaskQueryDto): Promise<PaginationModel<ITask>>;

  /**
   * Fetches a task by identifier.
   * @param id - Task identifier.
   * @param includeArchived - When true, includes soft-deleted records.
   * @returns The matching task DTO.
   */
  abstract findOne(id: string, includeArchived?: boolean): Promise<ITask>;

  /**
   * Updates a task with the provided data.
   * @param id - Task identifier.
   * @param dto - Update payload.
   * @returns The updated task DTO.
   */
  abstract update(id: string, dto: UpdateTaskDto): Promise<ITask>;

  /**
   * Soft deletes a task.
   * @param id - Task identifier.
   */
  abstract remove(id: string): Promise<void>;
}
