import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'src/common/pagination/paginated-response.decorator';
import { PaginationModel } from 'src/common/pagination/paginaton.model';

import { AbstractCategoryService } from './abstract/category.abstract.service';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponse } from './responses/category.response';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: AbstractCategoryService) {}

  @Post()
  @ApiCreatedResponse({ type: CategoryResponse })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponse> {
    const category = await this.categoryService.create(dto);
    return new CategoryResponse(category);
  }

  @Get()
  @ApiPaginatedResponse(CategoryResponse)
  async findAll(
    @Query() query: CategoryQueryDto,
  ): Promise<PaginationModel<CategoryResponse>> {
    const categories = await this.categoryService.findAll(query);
    const items = categories.items.map(
      (category) => new CategoryResponse(category),
    );

    return new PaginationModel<CategoryResponse>(
      items,
      query,
      categories.meta.itemCount,
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryResponse })
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    const category = await this.categoryService.findOne(id);
    return new CategoryResponse(category);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.update(id, dto);
    return new CategoryResponse(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Category soft-deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(id);
  }
}
