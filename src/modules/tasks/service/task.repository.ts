import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';

import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { AbstractTaskRepository } from '../abstract/task.abstract.repository';
import { TaskQueryDto } from '../dto/task-query.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskSortField } from '../enums/task-sort-field.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { ITask } from '../interface/task.interface';

@Injectable()
export class TaskRepository extends AbstractTaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
  ) {
    super();
  }

  initialize(): TaskEntity {
    return this.repo.create();
  }

  async save(task: TaskEntity): Promise<TaskEntity> {
    return this.repo.save(task);
  }

  async findPaginated(
    query: TaskQueryDto,
  ): Promise<PaginationModel<ITask>> {
    const qb = this.buildBaseQuery();

    this.applyArchivalFilter(qb, query.includeArchived);
    this.applyStatusesFilter(qb, query.status);
    this.applyPriorityFilter(qb, query.priority);
    this.applyCategoryFilter(qb, query.categoryId);
    this.applyDueDateFilters(qb, query.dueDateFrom, query.dueDateTo);
    this.applySearchFilter(qb, query.search);

    const sortBy = query.sortBy ?? TaskSortField.DUE_DATE;
    const sortDirection = (query.sortDirection ?? 'asc').toUpperCase() as
      | 'ASC'
      | 'DESC';

    this.applySorting(qb, sortBy, sortDirection);

    qb.skip(query.skip).take(query.limit);

    const [records, count] = await qb.getManyAndCount();
    const items = records.map((record) => this.mapToInterface(record));

    return new PaginationModel<ITask>(items, query, count);
  }

  async findDetailedById(
    id: string,
    includeArchived = false,
  ): Promise<TaskEntity | null> {
    const qb = this.buildBaseQuery().andWhere('task.id = :id', { id });
    this.applyArchivalFilter(qb, includeArchived);
    return qb.getOne();
  }

  async findActiveWithCategory(id: string): Promise<TaskEntity | null> {
    return this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['category'],
    });
  }

  async softDeleteById(id: string): Promise<void> {
    const task = await this.repo.findOne({ where: { id }, withDeleted: true });

    if (!task || task.deletedAt) {
      return;
    }

    await this.repo.softRemove(task);
  }

  mapToInterface(task: TaskEntity): ITask {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate ?? null,
      dueDate: task.dueDate ?? null,
      estimatedHours: task.estimatedHours ?? null,
      actualHours: task.actualHours ?? null,
      progress: task.progress,
      categoryId: task.categoryId ?? null,
      category: task.category
        ? {
            id: task.category.id,
            name: task.category.name,
            color: task.category.color ?? null,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deletedAt: task.deletedAt ?? null,
    };
  }

  private buildBaseQuery(): SelectQueryBuilder<TaskEntity> {
    return this.repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category');
  }

  private applyArchivalFilter(
    qb: SelectQueryBuilder<TaskEntity>,
    includeArchived?: boolean,
  ): void {
    if (includeArchived) {
      qb.withDeleted();
    } else {
      qb.andWhere('task.deletedAt IS NULL');
    }
  }

  private applyStatusesFilter(
    qb: SelectQueryBuilder<TaskEntity>,
    status?: TaskStatus | TaskStatus[],
  ): void {
    const statuses = this.normalizeToArray(status);
    if (statuses.length) {
      qb.andWhere('task.status IN (:...status)', { status: statuses });
    }
  }

  private applyPriorityFilter(
    qb: SelectQueryBuilder<TaskEntity>,
    priority?: TaskPriority | TaskPriority[],
  ): void {
    const priorities = this.normalizeToArray(priority);
    if (priorities.length) {
      qb.andWhere('task.priority IN (:...priority)', { priority: priorities });
    }
  }

  private applyCategoryFilter(
    qb: SelectQueryBuilder<TaskEntity>,
    categoryId?: string,
  ): void {
    if (!categoryId) {
      return;
    }

    qb.andWhere('task.categoryId = :categoryId', { categoryId });
  }

  private applyDueDateFilters(
    qb: SelectQueryBuilder<TaskEntity>,
    dueDateFrom?: string,
    dueDateTo?: string,
  ): void {
    if (dueDateFrom) {
      qb.andWhere('task.dueDate >= :dueDateFrom', {
        dueDateFrom: new Date(dueDateFrom).toISOString(),
      });
    }

    if (dueDateTo) {
      qb.andWhere('task.dueDate <= :dueDateTo', {
        dueDateTo: new Date(dueDateTo).toISOString(),
      });
    }
  }

  private applySearchFilter(
    qb: SelectQueryBuilder<TaskEntity>,
    search?: string,
  ): void {
    if (!search) {
      return;
    }

    const normalized = `%${search.toLowerCase()}%`;
    qb.andWhere(
      '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
      { search: normalized },
    );
  }

  private applySorting(
    qb: SelectQueryBuilder<TaskEntity>,
    sortBy: TaskSortField,
    sortDirection: 'ASC' | 'DESC',
  ): void {
    const direction = sortDirection === 'ASC' ? 'ASC' : 'DESC';

    switch (sortBy) {
      case TaskSortField.CREATED_AT:
        qb.orderBy('task.createdAt', direction);
        break;
      case TaskSortField.PRIORITY:
        qb.orderBy('task.priority', direction).addOrderBy(
          'task.createdAt',
          'DESC',
        );
        break;
      case TaskSortField.STATUS:
        qb.orderBy('task.status', direction).addOrderBy(
          'task.createdAt',
          'DESC',
        );
        break;
      case TaskSortField.DUE_DATE:
      default:
        qb.orderBy('task.dueDate', direction, 'NULLS LAST').addOrderBy(
          'task.createdAt',
          'DESC',
        );
        break;
    }
  }

  private normalizeToArray<T>(value?: T | T[]): T[] {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }
}
