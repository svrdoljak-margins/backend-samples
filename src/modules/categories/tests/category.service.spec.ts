import 'reflect-metadata';

import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from '../../../common/exceptions/custom.exception';
import { CategoryService } from '../service/category.service';
import { CategoryEntity } from '../entities/category.entity';

type MockedQueryBuilder = Pick<
  SelectQueryBuilder<CategoryEntity>,
  | 'leftJoin'
  | 'loadRelationCountAndMap'
  | 'where'
  | 'andWhere'
  | 'orderBy'
  | 'skip'
  | 'take'
  | 'getManyAndCount'
  | 'getOne'
>;

const createQueryBuilderMock = (): jest.Mocked<MockedQueryBuilder> => ({
  leftJoin: jest.fn().mockReturnThis(),
  loadRelationCountAndMap: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getOne: jest.fn(),
});

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Repository<CategoryEntity>>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      softRemove: jest.fn(),
    } as unknown as jest.Mocked<Repository<CategoryEntity>>;

    service = new CategoryService(repository);
  });

  it('creates a category and normalises fields', async () => {
    const dto = {
      name: '  Delivery  ',
      description: '  Hands over finished work  ',
      color: '#ff2200',
    };

    const expectedCategory: CategoryEntity = {
      id: 'cat-1',
      name: 'Delivery',
      description: 'Hands over finished work',
      color: '#FF2200',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    } as CategoryEntity;

    const qb = createQueryBuilderMock();
    qb.getOne.mockResolvedValue({ ...expectedCategory, taskCount: 0 });

    repository.findOne.mockResolvedValueOnce(null);
    repository.create.mockReturnValue(expectedCategory);
    repository.save.mockResolvedValueOnce(expectedCategory);
    repository.createQueryBuilder.mockReturnValue(qb as never);

    const response = await service.create(dto);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Delivery',
        description: 'Hands over finished work',
        color: '#FF2200',
      }),
    );
    expect(response).toEqual(
      expect.objectContaining({
        name: 'Delivery',
        color: '#FF2200',
        taskCount: 0,
      }),
    );
  });

  it('throws when creating a duplicate category name', async () => {
    repository.findOne.mockResolvedValueOnce({
      id: 'existing',
    } as CategoryEntity);

    await expect(
      service.create({
        name: 'Finance',
        description: undefined,
        color: undefined,
      }),
    ).rejects.toBeInstanceOf(TaskManagerConflictException);
  });

  it('throws when updating a missing category', async () => {
    repository.findOne.mockResolvedValueOnce(null);

    await expect(
      service.update('missing', {
        name: 'New',
        description: undefined,
        color: undefined,
      }),
    ).rejects.toBeInstanceOf(TaskManagerNotFoundException);
  });

  it('updates fields and enforces uniqueness during update', async () => {
    const existing: CategoryEntity = {
      id: 'cat-1',
      name: 'Engineering',
      description: 'Delivery team',
      color: '#0000FF',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    } as CategoryEntity;

    const updated: CategoryEntity = {
      ...existing,
      name: 'Delivery',
      color: '#FFAA00',
      description: 'Hands over work',
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    } as CategoryEntity;

    const qb = createQueryBuilderMock();
    qb.getOne.mockResolvedValueOnce({ ...updated, taskCount: 0 });

    repository.findOne
      .mockResolvedValueOnce(existing) // getActiveCategoryOrThrow
      .mockResolvedValueOnce(null); // assertNameIsUnique
    repository.save.mockResolvedValueOnce(updated);
    repository.createQueryBuilder.mockReturnValue(qb as never);

    const response = await service.update(existing.id, {
      name: '  Delivery  ',
      description: ' Hands over work ',
      color: '#ffaa00',
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Delivery',
        description: 'Hands over work',
        color: '#FFAA00',
      }),
    );
    expect(response).toEqual(
      expect.objectContaining({ name: 'Delivery', color: '#FFAA00' }),
    );
  });
});
