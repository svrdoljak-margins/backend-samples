import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';

import {
  TaskManagerNotFoundException,
  TaskManagerValidationException,
} from '../../../common/exceptions/custom.exception';
import { PaginationModel } from '../../../common/pagination/paginaton.model';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskSortField } from '../enums/task-sort-field.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskResponse } from '../responses/task.response';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskResponse> {
    const task = this.taskRepository.create();
    await this.applyDto(task, dto);

    const saved = await this.taskRepository.save(task);
    return this.findOne(saved.id);
  }

  async findAll(query: TaskQueryDto): Promise<PaginationModel<TaskResponse>> {
    const qb = this.buildBaseQuery();

    this.applyArchivalFilter(qb, query.includeArchived);
    this.applyStatusesFilter(qb, query.status);
    this.applyPriorityFilter(qb, query.priority);
    this.applyCategoryFilter(qb, query.categoryId);
    this.applyDueDateFilters(qb, query.dueDateFrom, query.dueDateTo);
    this.applySearchFilter(qb, query.search);

    const sortBy = query.sortBy ?? TaskSortField.DueDate;
    const sortDirection = (query.sortDirection ?? 'asc').toUpperCase() as
      | 'ASC'
      | 'DESC';

    this.applySorting(qb, sortBy, sortDirection);

    qb.skip(query.skip).take(query.limit);

    const [records, count] = await qb.getManyAndCount();
    const items = records.map((record) => new TaskResponse(record));

    return new PaginationModel<TaskResponse>(items, query, count);
  }

  async findOne(id: string, includeArchived = false): Promise<TaskResponse> {
    const qb = this.buildBaseQuery();
    qb.andWhere('task.id = :id', { id });
    this.applyArchivalFilter(qb, includeArchived);

    const task = await qb.getOne();

    if (!task) {
      throw new TaskManagerNotFoundException('Task was not found');
    }

    return new TaskResponse(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['category'],
    });

    if (!task) {
      throw new TaskManagerNotFoundException('Task was not found');
    }

    await this.applyDto(task, dto);

    const saved = await this.taskRepository.save(task);
    return this.findOne(saved.id);
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task || task.deletedAt) {
      return;
    }

    await this.taskRepository.softRemove(task);
  }

  private buildBaseQuery(): SelectQueryBuilder<TaskEntity> {
    return this.taskRepository
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
      case TaskSortField.CreatedAt:
        qb.orderBy('task.createdAt', direction);
        break;
      case TaskSortField.Priority:
        qb.orderBy('task.priority', direction).addOrderBy(
          'task.createdAt',
          'DESC',
        );
        break;
      case TaskSortField.Status:
        qb.orderBy('task.status', direction).addOrderBy(
          'task.createdAt',
          'DESC',
        );
        break;
      case TaskSortField.DueDate:
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

  private async applyDto(
    task: TaskEntity,
    dto: Partial<CreateTaskDto>,
  ): Promise<void> {
    this.setTitle(task, dto.title);
    this.setDescription(task, dto.description);
    this.setStatus(task, dto.status);
    this.setPriority(task, dto.priority);
    this.setDates(task, dto.startDate, dto.dueDate);
    this.setEffort(task, dto.estimatedHours, dto.actualHours);
    this.setProgress(task, dto.progress);
    await this.setCategory(task, dto.categoryId);
  }

  private setTitle(task: TaskEntity, title?: string): void {
    if (title === undefined) {
      return;
    }

    task.title = title.trim();
  }

  private setDescription(task: TaskEntity, description?: string): void {
    if (description === undefined) {
      return;
    }

    task.description = description?.trim() ?? null;
  }

  private setStatus(task: TaskEntity, status?: TaskStatus): void {
    if (status) {
      task.status = status;
      return;
    }

    if (!task.status) {
      task.status = TaskStatus.Backlog;
    }
  }

  private setPriority(task: TaskEntity, priority?: TaskPriority): void {
    if (priority) {
      task.priority = priority;
      return;
    }

    if (!task.priority) {
      task.priority = TaskPriority.Medium;
    }
  }

  private setDates(
    task: TaskEntity,
    startDate?: string,
    dueDate?: string,
  ): void {
    if (startDate !== undefined) {
      task.startDate = startDate ? new Date(startDate) : null;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    this.ensureValidDateRange(task.startDate, task.dueDate);
  }

  private ensureValidDateRange(
    startDate?: Date | null,
    dueDate?: Date | null,
  ): void {
    if (startDate && dueDate && dueDate < startDate) {
      throw new TaskManagerValidationException(
        'Due date cannot be earlier than the start date',
      );
    }
  }

  private setEffort(
    task: TaskEntity,
    estimatedHours?: number,
    actualHours?: number,
  ): void {
    if (estimatedHours !== undefined) {
      task.estimatedHours = estimatedHours ?? null;
    }

    if (actualHours !== undefined) {
      task.actualHours = actualHours ?? null;
    }
  }

  private setProgress(task: TaskEntity, progress?: number): void {
    if (progress !== undefined) {
      task.progress = Math.min(100, Math.max(0, Math.round(progress)));
      return;
    }

    if (typeof task.progress !== 'number') {
      task.progress = 0;
    }
  }

  private async setCategory(
    task: TaskEntity,
    categoryId?: string,
  ): Promise<void> {
    if (categoryId === undefined) {
      return;
    }

    if (!categoryId) {
      task.category = null;
      task.categoryId = null;
      return;
    }

    if (task.category?.id === categoryId) {
      return;
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, deletedAt: IsNull() },
    });

    if (!category) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    task.category = category;
    task.categoryId = category.id;
  }
}
