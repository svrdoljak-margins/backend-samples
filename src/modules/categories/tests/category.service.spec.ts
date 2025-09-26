import 'reflect-metadata';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from '../../../common/exceptions/custom.exception';
import { PaginationModel } from '../../../common/pagination/paginaton.model';
import { AbstractCategoryRepository } from '../abstract/category.abstract.repository';
import { CategoryService } from '../service/category.service';
import { CategoryEntity } from '../entities/category.entity';
import { ICategory } from '../interface/category.interface';

const createRepositoryMock = (): jest.Mocked<AbstractCategoryRepository> => ({
  createCategory: jest.fn(),
  findPaginatedWithTaskCount: jest.fn(),
  findOneWithTaskCount: jest.fn(),
  findActiveById: jest.fn(),
  save: jest.fn(),
  softDeleteById: jest.fn(),
  findByNameCaseInsensitive: jest.fn(),
});

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<AbstractCategoryRepository>;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new CategoryService(repository);
  });

  it('creates a category and normalises fields', async () => {
    const dto = {
      name: '  Delivery  ',
      description: '  Hands over finished work  ',
      color: '#ff2200',
    };

    const expectedCategory: ICategory = {
      id: 'cat-1',
      name: 'Delivery',
      description: 'Hands over finished work',
      color: '#FF2200',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deletedAt: null,
      taskCount: 0,
    };

    repository.findByNameCaseInsensitive.mockResolvedValueOnce(null);
    repository.createCategory.mockResolvedValueOnce(expectedCategory);

    const response = await service.create(dto);

    expect(repository.createCategory).toHaveBeenCalledWith({
      name: 'Delivery',
      description: 'Hands over finished work',
      color: '#FF2200',
    });
    expect(response).toEqual(expectedCategory);
  });

  it('returns paginated categories', async () => {
    const query = { limit: 10, page: 1, skip: 0 } as any;
    const categories: ICategory[] = [
      {
        id: 'cat-1',
        name: 'Delivery',
        description: 'Ships work',
        color: '#FFAA00',
        createdAt: new Date(),
        updatedAt: new Date(),
        taskCount: 2,
        deletedAt: null,
      },
    ];
    const expected = new PaginationModel(categories, query, categories.length);

    repository.findPaginatedWithTaskCount.mockResolvedValueOnce(expected);

    const result = await service.findAll(query);

    expect(repository.findPaginatedWithTaskCount).toHaveBeenCalledWith(query);
    expect(result).toBe(expected);
  });

  it('throws when creating a duplicate category name', async () => {
    repository.findByNameCaseInsensitive.mockResolvedValueOnce({
      id: 'existing',
      name: 'Finance',
      description: null,
      color: null,
      taskCount: 0,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deletedAt: null,
    });

    await expect(
      service.create({
        name: 'Finance',
        description: undefined,
        color: undefined,
      }),
    ).rejects.toBeInstanceOf(TaskManagerConflictException);
  });

  it('throws when updating a missing category', async () => {
    repository.findActiveById.mockResolvedValueOnce(null);

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
      deletedAt: null,
    } as CategoryEntity;

    const updatedEntity: CategoryEntity = {
      ...existing,
      name: 'Delivery',
      color: '#FFAA00',
      description: 'Hands over work',
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    } as CategoryEntity;

    const savedCategory: ICategory = {
      id: updatedEntity.id,
      name: updatedEntity.name,
      description: updatedEntity.description ?? null,
      color: updatedEntity.color ?? null,
      createdAt: updatedEntity.createdAt,
      updatedAt: updatedEntity.updatedAt,
      deletedAt: updatedEntity.deletedAt ?? null,
      taskCount: 0,
    };

    repository.findActiveById.mockResolvedValueOnce(existing);
    repository.findByNameCaseInsensitive.mockResolvedValueOnce(null);
    repository.save.mockResolvedValueOnce(savedCategory);
    repository.findOneWithTaskCount.mockResolvedValueOnce(savedCategory);

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
    expect(repository.findOneWithTaskCount).toHaveBeenCalledWith(existing.id);
    expect(response).toEqual(
      expect.objectContaining({ name: 'Delivery', color: '#FFAA00' }),
    );
  });

  it('removes a category via repository', async () => {
    await service.remove('cat-1');

    expect(repository.softDeleteById).toHaveBeenCalledWith('cat-1');
  });
});
