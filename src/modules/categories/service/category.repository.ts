import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { AbstractCategoryRepository } from '../abstract/category.abstract.repository';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { CategoryEntity } from '../entities/category.entity';
import { ICategory } from '../interface/category.interface';

@Injectable()
export class CategoryRepository extends AbstractCategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {
    super();
  }

  async createCategory(data: Partial<CategoryEntity>): Promise<ICategory> {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async findPaginatedWithTaskCount(
    query: CategoryQueryDto,
  ): Promise<PaginationModel<ICategory>> {
    const qb = this.buildTaskCountQuery().where('category.deletedAt IS NULL');

    if (query.search) {
      qb.andWhere('LOWER(category.name) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    qb.orderBy('category.createdAt', 'DESC').skip(query.skip).take(query.limit);

    const [items, count] = await qb.getManyAndCount();
    return new PaginationModel(items, query, count);
  }

  async findOneWithTaskCount(id: string): Promise<ICategory | null> {
    return this.buildTaskCountQuery()
      .where('category.id = :id', { id })
      .andWhere('category.deletedAt IS NULL')
      .getOne();
  }

  async findActiveById(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async save(category: CategoryEntity): Promise<ICategory> {
    return this.categoryRepo.save(category);
  }

  async softDeleteById(id: string): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category || category.deletedAt) {
      return;
    }

    await this.categoryRepo.softRemove(category);
  }

  async findByNameCaseInsensitive(
    name: string,
    excludeId?: string,
  ): Promise<ICategory | null> {
    const where: FindOptionsWhere<CategoryEntity> = { name: ILike(name) };

    if (excludeId) {
      where.id = Not(excludeId);
    }

    return this.categoryRepo.findOne({ where, withDeleted: true });
  }

  private buildTaskCountQuery(): SelectQueryBuilder<CategoryEntity> {
    return this.categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.tasks', 'task')
      .loadRelationCountAndMap(
        'category.taskCount',
        'category.tasks',
        'task',
        (subQb) => subQb.andWhere('task.deletedAt IS NULL'),
      );
  }
}
