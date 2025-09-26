import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ICategory } from '../interface/category.interface';

export abstract class AbstractCategoryService {
  /** Creates a new category. */
  abstract create(dto: CreateCategoryDto): Promise<ICategory>;

  /** Lists categories with pagination and task counts. */
  abstract findAll(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<ICategory>>;

  /** Finds a single category by id (throws if it does not exist). */
  abstract findOne(id: string): Promise<ICategory>;

  /** Updates an existing category. */
  abstract update(id: string, dto: UpdateCategoryDto): Promise<ICategory>;

  /** Soft deletes a category if it exists. */
  abstract remove(id: string): Promise<void>;
}
