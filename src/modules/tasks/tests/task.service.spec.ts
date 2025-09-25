import 'reflect-metadata';

import { Repository } from 'typeorm';

import {
  TaskManagerNotFoundException,
  TaskManagerValidationException,
} from '../../../common/exceptions/custom.exception';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { TaskEntity } from '../entities/task.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskService } from '../service/task.service';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Partial<Repository<TaskEntity>>;
  let categoryRepository: Partial<Repository<CategoryEntity>>;

  beforeEach(() => {
    taskRepository = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      withDeleted: jest.fn(),
    } as Partial<Repository<TaskEntity>>;

    categoryRepository = {
      findOne: jest.fn(),
    } as Partial<Repository<CategoryEntity>>;

    service = new TaskService(
      taskRepository as Repository<TaskEntity>,
      categoryRepository as Repository<CategoryEntity>,
    );
  });

  describe('applyDto', () => {
    it('throws when due date precedes the start date', async () => {
      const task = new TaskEntity();

      await expect(
        (service as unknown as { applyDto: TaskService['applyDto'] }).applyDto(
          task,
          {
            title: 'Launch website',
            startDate: '2024-01-02T00:00:00.000Z',
            dueDate: '2024-01-01T00:00:00.000Z',
          },
        ),
      ).rejects.toBeInstanceOf(TaskManagerValidationException);
    });

    it('clamps progress into the 0-100 range and defaults status/priority', async () => {
      const task = new TaskEntity();
      const category: CategoryEntity = {
        id: 'cat-1',
        name: 'Marketing',
        description: null,
        color: '#FF0000',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
      } as CategoryEntity;

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(category as CategoryEntity);

      await (
        service as unknown as { applyDto: TaskService['applyDto'] }
      ).applyDto(task, {
        title: 'Launch website',
        progress: 215,
        categoryId: category.id,
        startDate: '2024-01-01T00:00:00.000Z',
        dueDate: '2024-01-10T00:00:00.000Z',
        estimatedHours: 40,
      });

      expect(task.progress).toBe(100);
      expect(task.status).toBe(TaskStatus.Backlog);
      expect(task.priority).toBe(TaskPriority.Medium);
      expect(task.categoryId).toBe(category.id);
      expect(task.category).toBe(category);
      expect(categoryRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: category.id, deletedAt: expect.anything() },
        }),
      );
    });

    it('rejects requests referencing a missing category', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        (service as unknown as { applyDto: TaskService['applyDto'] }).applyDto(
          new TaskEntity(),
          {
            title: 'Publish release notes',
            categoryId: 'missing-cat',
          },
        ),
      ).rejects.toBeInstanceOf(TaskManagerNotFoundException);
    });

    it('normalises negative progress to 0', async () => {
      const task = new TaskEntity();

      await (
        service as unknown as { applyDto: TaskService['applyDto'] }
      ).applyDto(task, {
        title: 'Backlog grooming',
        progress: -20,
      });

      expect(task.progress).toBe(0);
    });
  });
});
