import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbstractCategoryRepository } from './abstract/category.abstract.repository';
import { AbstractCategoryService } from './abstract/category.abstract.service';
import { CategoryController } from './categories.controller';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './service/category.repository';
import { CategoryService } from './service/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    CategoryService,
    {
      provide: AbstractCategoryRepository,
      useExisting: CategoryRepository,
    },
    {
      provide: AbstractCategoryService,
      useExisting: CategoryService,
    },
  ],
  exports: [AbstractCategoryRepository, AbstractCategoryService],
})
export class CategoryModule {}
