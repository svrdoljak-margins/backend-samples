import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { TaskQueryDto } from '../dto/task-query.dto';
import { TaskEntity } from '../entities/task.entity';
import { ITask } from '../interface/task.interface';

export abstract class AbstractTaskRepository {
  abstract initialize(): TaskEntity;

  abstract save(task: TaskEntity): Promise<TaskEntity>;

  abstract findPaginated(
    query: TaskQueryDto,
  ): Promise<PaginationModel<ITask>>;

  abstract findDetailedById(
    id: string,
    includeArchived?: boolean,
  ): Promise<TaskEntity | null>;

  abstract findActiveWithCategory(id: string): Promise<TaskEntity | null>;

  abstract softDeleteById(id: string): Promise<void>;

  abstract mapToInterface(entity: TaskEntity): ITask;
}
