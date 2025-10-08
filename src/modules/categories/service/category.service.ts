import { Injectable } from '@nestjs/common';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from 'src/common/exceptions/custom.exception';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { AbstractCategoryRepository } from '../abstract/category.abstract.repository';
import { AbstractCategoryService } from '../abstract/category.abstract.service';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { ICategory } from '../interface/category.interface';

@Injectable()
export class CategoryService extends AbstractCategoryService {
  constructor(private readonly categoryRepository: AbstractCategoryRepository) {
    super();
  }

  /**
   * Creates a new category and ensures the name is unique.
   * @param dto - Data describing the category to create.
   * @returns The persisted category DTO.
   */
  async create(dto: CreateCategoryDto): Promise<ICategory> {
    const normalizedName = dto.name.trim();
    await this.assertNameIsUnique(normalizedName);

    return this.categoryRepository.createCategory({
      name: normalizedName,
      description: dto.description?.trim() ?? null,
      color: dto.color?.toUpperCase() ?? null,
    });
  }

  /**
   * Retrieves categories using pagination utilities from the repository.
   * @param query - Pagination and filter options.
   * @returns Paginated categories enriched with task counts.
   */
  async findAll(query: CategoryQueryDto): Promise<PaginationModel<ICategory>> {
    return this.categoryRepository.findPaginatedWithTaskCount(query);
  }

  /**
   * Fetches a single category, throwing when missing.
   * @param id - Category identifier.
   * @returns The requested category DTO.
   */
  async findOne(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findOneWithTaskCount(id);

    if (!category) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    return category;
  }

  /**
   * Updates an existing category by merging the provided changes.
   * @param id - Category identifier.
   * @param dto - Update payload.
   * @returns The updated category DTO.
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.categoryRepository.findActiveById(id);

    if (!category) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    await this.updateNameIfNeeded(category, dto, id);
    this.updateDescription(category, dto);
    this.updateColor(category, dto);

    await this.categoryRepository.save(category);
    return this.findOne(id);
  }

  /**
   * Soft deletes a category.
   * @param id - Category identifier.
   */
  async remove(id: string): Promise<void> {
    await this.categoryRepository.softDeleteById(id);
  }

  private async assertNameIsUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.categoryRepository.findByNameCaseInsensitive(
      name,
      excludeId,
    );

    if (existing) {
      throw new TaskManagerConflictException('Category name is already in use');
    }
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
