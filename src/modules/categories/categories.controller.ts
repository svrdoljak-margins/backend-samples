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
import { plainToInstance } from 'class-transformer';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'src/common/pagination/paginated-response.decorator';
import { PaginationModel } from 'src/common/pagination/paginaton.model';
import { UuidParamDto } from 'src/common/dto/uuid-param.dto';

import { AbstractCategoryService } from './abstract/category.abstract.service';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponse } from './responses/category.response';
import { ICreateCategoryInput } from './interface/create-category-input.interface';
import { IUpdateCategoryInput } from './interface/update-category-input.interface';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: AbstractCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully.',
    type: CategoryResponse,
  })
  /**
   * Creates a category.
   * @param dto - Payload describing the category to create.
   * @returns Newly created category response.
   */
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponse> {
    const payload: ICreateCategoryInput = {
      name: dto.name,
      description: dto.description,
      color: dto.color,
    };

    const category = await this.categoryService.create(payload);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List categories' })
  @ApiPaginatedResponse(CategoryResponse)
  /**
   * Lists categories using pagination query params.
   * @param query - Pagination and filtering options.
   * @returns Paginated category responses.
   */
  async findAll(
    @Query() query: CategoryQueryDto,
  ): Promise<PaginationModel<CategoryResponse>> {
    const categories = await this.categoryService.findAll(query);
    const items = plainToInstance(CategoryResponse, categories.items, {
      excludeExtraneousValues: true,
    });

    return new PaginationModel<CategoryResponse>(
      items,
      query,
      categories.meta.itemCount,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Category returned successfully.',
    type: CategoryResponse,
  })
  /**
   * Retrieves a single category.
   * @param param - Route parameter DTO containing the identifier.
   * @returns Category response.
   */
  async findOne(@Param() { id }: UuidParamDto): Promise<CategoryResponse> {
    const category = await this.categoryService.findOne(id);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully.',
    type: CategoryResponse,
  })
  /**
   * Updates a category.
   * @param param - Route parameter DTO containing the identifier.
   * @param dto - Update payload.
   * @returns Updated category response.
   */
  async update(
    @Param() { id }: UuidParamDto,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    const payload: IUpdateCategoryInput = {
      name: dto.name,
      description: dto.description,
      color: dto.color,
    };

    const category = await this.categoryService.update(id, payload);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a category' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category soft-deleted successfully.',
  })
  /**
   * Soft deletes a category.
   * @param param - Route parameter DTO containing the identifier.
   */
  async remove(@Param() { id }: UuidParamDto): Promise<void> {
    await this.categoryService.remove(id);
  }
}
