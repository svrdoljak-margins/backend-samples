import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Not, Repository } from 'typeorm';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from 'src/common/exceptions/custom.exception';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryResponse } from '../responses/category.response';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    const normalizedName = dto.name.trim();
    await this.assertNameIsUnique(normalizedName);

    const category = this.categoryRepository.create({
      name: normalizedName,
      description: dto.description?.trim(),
      color: dto.color?.toUpperCase(),
    });

    const saved = await this.categoryRepository.save(category);
    return new CategoryResponse({ ...saved, taskCount: 0 });
  }

  async findAll(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<CategoryResponse>> {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.tasks', 'task')
      .loadRelationCountAndMap(
        'category.taskCount',
        'category.tasks',
        'task',
        (subQb) => subQb.andWhere('task.deletedAt IS NULL'),
      )
      .where('category.deletedAt IS NULL');

    if (query.search) {
      qb.andWhere('LOWER(category.name) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    qb.orderBy('category.createdAt', 'DESC').skip(query.skip).take(query.limit);

    const [items, count] = await qb.getManyAndCount();
    const responses = items.map((item) => new CategoryResponse(item));

    return new PaginationModel<CategoryResponse>(responses, query, count);
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.tasks', 'task')
      .loadRelationCountAndMap(
        'category.taskCount',
        'category.tasks',
        'task',
        (subQb) => subQb.andWhere('task.deletedAt IS NULL'),
      )
      .where('category.id = :id', { id })
      .andWhere('category.deletedAt IS NULL')
      .getOne();

    if (!category) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    return new CategoryResponse(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    const category = await this.getActiveCategoryOrThrow(id);

    await this.updateNameIfNeeded(category, dto, id);
    this.updateDescription(category, dto);
    this.updateColor(category, dto);

    const saved = await this.categoryRepository.save(category);
    return this.findOne(saved.id);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category || category.deletedAt) {
      // Already deleted or never existed
      return;
    }

    await this.categoryRepository.softRemove(category);
  }

  private async assertNameIsUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const where: FindOptionsWhere<CategoryEntity> = { name: ILike(name) };

    if (excludeId) {
      where.id = Not(excludeId);
    }

    const existing = await this.categoryRepository.findOne({
      where,
      withDeleted: true,
    });

    if (existing) {
      throw new TaskManagerConflictException('Category name is already in use');
    }
  }

  private async getActiveCategoryOrThrow(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!category) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    return category;
  }

  private async updateNameIfNeeded(
    category: CategoryEntity,
    dto: UpdateCategoryDto,
    id: string,
  ): Promise<void> {
    if (dto.name === undefined) {
      return;
    }

    const normalizedName = dto.name.trim();

    if (normalizedName === category.name) {
      return;
    }

    await this.assertNameIsUnique(normalizedName, id);
    category.name = normalizedName;
  }

  private updateDescription(
    category: CategoryEntity,
    dto: UpdateCategoryDto,
  ): void {
    if (dto.description === undefined) {
      return;
    }

    category.description = dto.description?.trim() ?? null;
  }

  private updateColor(category: CategoryEntity, dto: UpdateCategoryDto): void {
    if (dto.color === undefined) {
      return;
    }

    category.color = dto.color?.toUpperCase() ?? null;
  }
}
