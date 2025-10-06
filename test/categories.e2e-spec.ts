import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import request, { SuperTest, Test } from 'supertest';
import { DataSource } from 'typeorm';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let api: SuperTest<Test>;
  let dataSource: DataSource;
  const truncateTables = async (): Promise<void> => {
    await dataSource.query(
      'TRUNCATE TABLE "tasks", "categories" RESTART IDENTITY CASCADE',
    );
  };

  beforeAll(() => {
    app = global.app!;
    api = request(app.getHttpServer());
    dataSource = global.dataSource!;
  });

  beforeEach(async () => {
    await truncateTables();
  });

  it('supports the full category lifecycle with pagination metadata', async () => {
    const payload = {
      name: 'Productivity',
      description: 'Tasks that improve focus and delivery',
      color: '#3366FF',
    };

    const createResponse = await api
      .post('/api/v1/categories')
      .send(payload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      name: payload.name,
      description: payload.description,
      color: payload.color,
    });

    const categoryId = createResponse.body.id as string;

    const duplicateResponse = await api
      .post('/api/v1/categories')
      .send(payload)
      .expect(409);

    expect(duplicateResponse.body).toEqual(
      expect.objectContaining({
        statusCode: 409,
        code: expect.stringContaining('TASKMGR'),
        message: 'Category name is already in use',
      }),
    );

    const listResponse = await api.get('/api/v1/categories').expect(200);

    expect(listResponse.body.items).toHaveLength(1);
    expect(listResponse.body.meta).toEqual(
      expect.objectContaining({ itemCount: 1, page: 1, limit: 10 }),
    );

    const searchResponse = await api
      .get('/api/v1/categories')
      .query({ search: 'product' })
      .expect(200);

    expect(searchResponse.body.items[0].id).toBe(categoryId);

    const getResponse = await api
      .get(`/api/v1/categories/${categoryId}`)
      .expect(200);

    expect(getResponse.body).toMatchObject({
      id: categoryId,
      name: payload.name,
    });

    const updateResponse = await api
      .patch(`/api/v1/categories/${categoryId}`)
      .send({
        name: 'Delivery',
        color: '#FFAA00',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: categoryId,
      name: 'Delivery',
      color: '#FFAA00',
    });

    await api.delete(`/api/v1/categories/${categoryId}`).expect(204);

    await api.get(`/api/v1/categories/${categoryId}`).expect(404);
  });

  it('returns validation errors for malformed payloads', async () => {
    const response = await api
      .post('/api/v1/categories')
      .send({ name: 'ab', color: 'invalid-color' })
      .expect(422);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 422,
        message: expect.any(String),
      }),
    );
  });
});
