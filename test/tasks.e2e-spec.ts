import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import request, { SuperTest, Test } from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { CategoryEntity } from '../src/modules/categories/entities/category.entity';
import { TaskPriority } from '../src/modules/tasks/enums/task-priority.enum';
import { TaskStatus } from '../src/modules/tasks/enums/task-status.enum';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let api: SuperTest<Test>;
  let dataSource: DataSource;
  let categoryRepository: Repository<CategoryEntity>;

  const truncateTables = async (): Promise<void> => {
    await dataSource.query(
      'TRUNCATE TABLE "tasks", "categories" RESTART IDENTITY CASCADE',
    );
  };

  beforeAll(() => {
    app = global.app!;
    api = request(app.getHttpServer());
    dataSource = global.dataSource!;
    categoryRepository = dataSource.getRepository(CategoryEntity);
  });

  beforeEach(async () => {
    await truncateTables();
  });

  it('validates dates and creates a full task lifecycle', async () => {
    const category = await categoryRepository.save(
      categoryRepository.create({
        name: 'Engineering',
        description: 'Build & operate',
        color: '#00AA77',
      }),
    );

    const createResponse = await api
      .post('/api/v1/tasks')
      .send({
        title: 'Ship onboarding flow',
        description: 'Implement new user onboarding UI',
        status: TaskStatus.Backlog,
        priority: TaskPriority.High,
        startDate: '2024-01-01T00:00:00.000Z',
        dueDate: '2024-01-15T00:00:00.000Z',
        estimatedHours: 24,
        progress: 25,
        categoryId: category.id,
      })
      .expect(201);

    const taskId = createResponse.body.id as string;
    expect(createResponse.body.category.id).toBe(category.id);

    const listResponse = await api
      .get('/api/v1/tasks')
      .query({ categoryId: category.id })
      .expect(200);

    expect(listResponse.body.items).toHaveLength(1);
    expect(listResponse.body.items[0].id).toBe(taskId);

    const filteredResponse = await api
      .get('/api/v1/tasks')
      .query({ status: TaskStatus.Completed })
      .expect(200);

    expect(filteredResponse.body.items).toHaveLength(0);

    const updateResponse = await api
      .patch(`/api/v1/tasks/${taskId}`)
      .send({
        status: TaskStatus.InProgress,
        progress: 80,
        actualHours: 12,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: taskId,
      status: TaskStatus.InProgress,
      progress: 80,
      actualHours: 12,
    });

    const statusFiltered = await api
      .get('/api/v1/tasks')
      .query({ status: TaskStatus.InProgress })
      .expect(200);

    expect(statusFiltered.body.items).toHaveLength(1);
    expect(statusFiltered.body.items[0].status).toBe(TaskStatus.InProgress);

    const getResponse = await api.get(`/api/v1/tasks/${taskId}`).expect(200);

    expect(getResponse.body.category.id).toBe(category.id);

    await api.delete(`/api/v1/tasks/${taskId}`).expect(204);

    await api.get(`/api/v1/tasks/${taskId}`).expect(404);
  });

  it('rejects tasks where due date precedes start date', async () => {
    const category = await categoryRepository.save(
      categoryRepository.create({
        name: 'QA',
        color: '#FF0000',
      }),
    );

    const response = await api
      .post('/api/v1/tasks')
      .send({
        title: 'Schedule regression testing',
        startDate: '2024-02-10T10:00:00.000Z',
        dueDate: '2024-02-05T10:00:00.000Z',
        categoryId: category.id,
      })
      .expect(422);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 422,
        message: 'Due date cannot be earlier than the start date',
      }),
    );
  });
});
