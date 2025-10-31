import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { TaskQueryDto } from '../dto/task-query.dto';
import { TaskEntity } from '../entities/task.entity';
import { ITask } from '../interface/task.interface';

export abstract class AbstractTaskRepository {
  /**
   * Creates a new task entity instance.
   * @returns A fresh task entity ready for population.
   */
  abstract initialize(): TaskEntity;

  /**
   * Persists the provided task entity.
   * @param task - Task entity to store.
   * @returns The saved task entity.
   */
  abstract save(task: TaskEntity): Promise<TaskEntity>;

  /**
   * Retrieves paginated tasks based on the supplied query.
   * @param query - Pagination and filtering criteria.
   * @returns Paginated task DTOs.
   */
  abstract findPaginated(
    query: TaskQueryDto,
  ): Promise<PaginationModel<ITask>>;

  /**
   * Finds a task with category details optionally including archived records.
   * @param id - Task identifier.
   * @param includeArchived - Include soft-deleted tasks when true.
   * @returns The matching task entity or null.
   */
  abstract findDetailedById(
    id: string,
    includeArchived?: boolean,
  ): Promise<TaskEntity | null>;

  /**
   * Finds an active task including its category relation.
   * @param id - Task identifier.
   * @returns The active task entity or null when not found.
   */
  abstract findActiveWithCategory(id: string): Promise<TaskEntity | null>;

  /**
   * Performs a soft delete on the specified task.
   * @param id - Task identifier.
   */
  abstract softDeleteById(id: string): Promise<void>;

  /**
   * Maps a task entity to its DTO representation.
   * @param entity - Task entity instance.
   * @returns The mapped task DTO.
   */
  abstract mapToInterface(entity: TaskEntity): ITask;
}
