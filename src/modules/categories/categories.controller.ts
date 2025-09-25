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

import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponse } from './responses/category.response';
import { CategoryService } from './service/category.service';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiCreatedResponse({ type: CategoryResponse })
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponse> {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(CategoryResponse)
  findAll(
    @Query() query: CategoryQueryDto,
  ): Promise<PaginationModel<CategoryResponse>> {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryResponse })
  findOne(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryResponse })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Category soft-deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(id);
  }
}
