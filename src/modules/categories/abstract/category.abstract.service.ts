import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { ICategory } from '../interface/category.interface';
import { ICreateCategoryInput } from '../interface/create-category-input.interface';
import { IUpdateCategoryInput } from '../interface/update-category-input.interface';

export abstract class AbstractCategoryService {
  /**
   * Creates a new category aggregate.
   * @param dto - Data describing the category to create.
   * @returns The created category representation.
   */
  abstract create(data: ICreateCategoryInput): Promise<ICategory>;

  /**
   * Lists categories with pagination and task counts applied.
   * @param query - Pagination and filtering criteria.
   * @returns Paginated categories enriched with task metrics.
   */
  abstract findAll(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<ICategory>>;

  /**
   * Retrieves a category by its identifier.
   * @param id - Category identifier.
   * @returns The requested category or throws when missing.
   */
  abstract findOne(id: string): Promise<ICategory>;

  /**
   * Updates the category with the provided data.
   * @param id - Category identifier.
   * @param dto - Properties to update.
   * @returns The updated category representation.
   */
  abstract update(id: string, data: IUpdateCategoryInput): Promise<ICategory>;

  /**
   * Soft deletes the category if it exists.
   * @param id - Category identifier.
   */
  abstract remove(id: string): Promise<void>;
}
