import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { ICategory } from '../interface/category.interface';
import { ICreateCategoryInput } from '../interface/create-category-input.interface';
import { IUpdateCategoryInput } from '../interface/update-category-input.interface';

export abstract class AbstractCategoryRepository {
  /**
   * Creates and persists a new category.
   * @param data - Category creation payload.
   * @returns The persisted category DTO.
   */
  abstract createCategory(data: ICreateCategoryInput): Promise<ICategory>;

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
   * Finds an active (non-deleted) category by id.
   * @param id - Category identifier.
   * @returns The category DTO or null if it does not exist.
   */
  abstract findActiveById(id: string): Promise<ICategory | null>;

  /**
   * Applies updates to an existing category.
   * @param id - Category identifier.
   * @param data - Properties to update.
   * @returns The updated category DTO.
   */
  abstract updateCategory(
    id: string,
    data: IUpdateCategoryInput,
  ): Promise<ICategory>;

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
