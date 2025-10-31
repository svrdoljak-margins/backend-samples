import { Injectable } from '@nestjs/common';

import {
  TaskManagerConflictException,
  TaskManagerNotFoundException,
} from 'src/common/exceptions/custom.exception';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { AbstractCategoryRepository } from '../abstract/category.abstract.repository';
import { AbstractCategoryService } from '../abstract/category.abstract.service';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { ICategory } from '../interface/category.interface';
import { ICreateCategoryInput } from '../interface/create-category-input.interface';
import { IUpdateCategoryInput } from '../interface/update-category-input.interface';

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
  async create(data: ICreateCategoryInput): Promise<ICategory> {
    const normalizedName = data.name.trim();
    await this.assertNameIsUnique(normalizedName);

    return this.categoryRepository.createCategory({
      name: normalizedName,
      description: data.description?.trim() ?? null,
      color: data.color?.toUpperCase() ?? null,
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
  async update(id: string, data: IUpdateCategoryInput): Promise<ICategory> {
    const existing = await this.categoryRepository.findActiveById(id);

    if (!existing) {
      throw new TaskManagerNotFoundException('Category was not found');
    }

    const updatePayload: IUpdateCategoryInput = {};

    if (data.name !== undefined) {
      const normalizedName = data.name.trim();
      if (normalizedName !== existing.name) {
        await this.assertNameIsUnique(normalizedName, id);
      }
      updatePayload.name = normalizedName;
    }

    if (data.description !== undefined) {
      updatePayload.description = data.description?.trim() ?? null;
    }

    if (data.color !== undefined) {
      updatePayload.color = data.color?.toUpperCase() ?? null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return this.findOne(id);
    }

    return this.categoryRepository.updateCategory(id, updatePayload);
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
}
