import 'reflect-metadata';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from '../../../common/exceptions/custom.exception';
import { PaginationModel } from '../../../common/pagination/paginaton.model';
import { AbstractCategoryRepository } from '../abstract/category.abstract.repository';
import { CategoryService } from '../service/category.service';
import { ICategory } from '../interface/category.interface';

const createRepositoryMock = (): jest.Mocked<AbstractCategoryRepository> => ({
  createCategory: jest.fn(),
  findPaginatedWithTaskCount: jest.fn(),
  findOneWithTaskCount: jest.fn(),
  findActiveById: jest.fn(),
  updateCategory: jest.fn(),
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
    const existing: ICategory = {
      id: 'cat-1',
      name: 'Engineering',
      description: 'Delivery team',
      color: '#0000FF',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deletedAt: null,
      taskCount: 3,
    };

    const updatedCategory: ICategory = {
      ...existing,
      name: 'Delivery',
      color: '#FFAA00',
      description: 'Hands over work',
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      taskCount: 5,
    };

    repository.findActiveById.mockResolvedValueOnce(existing);
    repository.findByNameCaseInsensitive.mockResolvedValueOnce(null);
    repository.updateCategory.mockResolvedValueOnce(updatedCategory);

    const response = await service.update(existing.id, {
      name: '  Delivery  ',
      description: ' Hands over work ',
      color: '#ffaa00',
    });

    expect(repository.updateCategory).toHaveBeenCalledWith(existing.id, {
      name: 'Delivery',
      description: 'Hands over work',
      color: '#FFAA00',
    });
    expect(response).toEqual(updatedCategory);
  });

  it('removes a category via repository', async () => {
    await service.remove('cat-1');

    expect(repository.softDeleteById).toHaveBeenCalledWith('cat-1');
  });
});
