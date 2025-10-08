import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { CategoryEntity } from '../entities/category.entity';
import { ICategory } from '../interface/category.interface';

export abstract class AbstractCategoryRepository {
  /**
   * Creates and persists a new category entity.
   * @param data - Partial category data used to build the entity.
   * @returns The persisted category DTO.
   */
  abstract createCategory(data: Partial<CategoryEntity>): Promise<ICategory>;

  /**
   * Retrieves categories with pagination metadata and task counts.
   * @param query - Pagination and filtering criteria.
   * @returns Paginated categories enriched with task counts.
   */
  abstract findPaginatedWithTaskCount(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<ICategory>>;

  /**
   * Retrieves a single category with its task count.
   * @param id - Category identifier.
   * @returns The category with metrics or null when not found.
   */
  abstract findOneWithTaskCount(id: string): Promise<ICategory | null>;

  /**
   * Finds an active (non-deleted) category entity by id.
   * @param id - Category identifier.
   * @returns The category entity or null if it does not exist.
   */
  abstract findActiveById(id: string): Promise<CategoryEntity | null>;

  /**
   * Persists the provided category entity.
   * @param category - Category entity to store.
   * @returns The stored category DTO.
   */
  abstract save(category: CategoryEntity): Promise<ICategory>;

  /**
   * Soft deletes a category by its identifier.
   * @param id - Identifier of the category to delete.
   */
  abstract softDeleteById(id: string): Promise<void>;

  /**
   * Finds a category by name ignoring casing.
   * @param name - Name to search for.
   * @param excludeId - Optional identifier to exclude (useful during updates).
   * @returns The matching category or null when no match exists.
   */
  abstract findByNameCaseInsensitive(
    name: string,
    excludeId?: string,
  ): Promise<ICategory | null>;
}
