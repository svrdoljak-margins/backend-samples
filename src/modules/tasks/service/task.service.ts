import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import {
  TaskManagerNotFoundException,
  TaskManagerValidationException,
} from '../../../common/exceptions/custom.exception';
import { PaginationModel } from '../../../common/pagination/paginaton.model';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { AbstractTaskRepository } from '../abstract/task.abstract.repository';
import { AbstractTaskService } from '../abstract/task.abstract.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { ITask } from '../interface/task.interface';

@Injectable()
export class TaskService extends AbstractTaskService {
  constructor(
    private readonly taskRepository: AbstractTaskRepository,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super();
  }

  /**
   * Creates a task aggregate and returns its DTO form.
   * @param dto - Task payload supplied by the client.
   * @returns Persisted task DTO.
   */
  async create(dto: CreateTaskDto): Promise<ITask> {
    const task = this.taskRepository.initialize();
    await this.applyDto(task, dto);

    const saved = await this.taskRepository.save(task);
    return this.findOne(saved.id);
  }

  /**
   * Retrieves tasks using repository pagination helpers.
   * @param query - Pagination and filter criteria.
   * @returns Paginated task DTOs.
   */
  async findAll(query: TaskQueryDto): Promise<PaginationModel<ITask>> {
    return this.taskRepository.findPaginated(query);
  }

  /**
   * Loads a task by identifier.
   * @param id - Task identifier.
   * @param includeArchived - When true, includes soft-deleted records.
   * @returns Task DTO or throws when missing.
   */
  async findOne(id: string, includeArchived = false): Promise<ITask> {
    const task = await this.taskRepository.findDetailedById(id, includeArchived);

    if (!task) {
      throw new TaskManagerNotFoundException('Task was not found');
    }

    return this.taskRepository.mapToInterface(task);
  }

  /**
   * Updates an existing task and returns the DTO.
   * @param id - Task identifier.
   * @param dto - Update payload.
   * @returns Updated task DTO.
   */
  async update(id: string, dto: UpdateTaskDto): Promise<ITask> {
    const task = await this.taskRepository.findActiveWithCategory(id);

    if (!task) {
      throw new TaskManagerNotFoundException('Task was not found');
    }

    await this.applyDto(task, dto);

    await this.taskRepository.save(task);
    return this.findOne(id);
  }

  /**
   * Soft deletes a task by identifier.
   * @param id - Task identifier.
   */
  async remove(id: string): Promise<void> {
    await this.taskRepository.softDeleteById(id);
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
