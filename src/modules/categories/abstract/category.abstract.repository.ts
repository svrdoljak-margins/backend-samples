import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { CategoryQueryDto } from '../dto/category-query.dto';
import { CategoryEntity } from '../entities/category.entity';
import { ICategory } from '../interface/category.interface';

export abstract class AbstractCategoryRepository {
  abstract createCategory(data: Partial<CategoryEntity>): Promise<ICategory>;

  abstract findPaginatedWithTaskCount(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<ICategory>>;

  abstract findOneWithTaskCount(id: string): Promise<ICategory | null>;

  abstract findActiveById(id: string): Promise<CategoryEntity | null>;

  abstract save(category: CategoryEntity): Promise<ICategory>;

  abstract softDeleteById(id: string): Promise<void>;

  abstract findByNameCaseInsensitive(
    name: string,
    excludeId?: string,
  ): Promise<ICategory | null>;
}
