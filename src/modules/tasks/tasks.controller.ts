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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'src/common/pagination/paginated-response.decorator';
import { PaginationModel } from 'src/common/pagination/paginaton.model';
import { UuidParamDto } from 'src/common/dto/uuid-param.dto';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse, mapTaskToResponse } from './responses/task.response';
import { AbstractTaskService } from './abstract/task.abstract.service';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: AbstractTaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully.',
    type: TaskResponse,
  })
  /**
   * Creates a task.
   * @param dto - Task payload supplied by the client.
   * @returns Newly created task response.
   */
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponse> {
    const task = await this.taskService.create(dto);
    return mapTaskToResponse(task);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks' })
  @ApiPaginatedResponse(TaskResponse)
  /**
   * Lists tasks using pagination query params.
   * @param query - Pagination and filter options.
   * @returns Paginated task responses.
   */
  async findAll(
    @Query() query: TaskQueryDto,
  ): Promise<PaginationModel<TaskResponse>> {
    const tasks = await this.taskService.findAll(query);
    const items = tasks.items.map(mapTaskToResponse);

    return new PaginationModel<TaskResponse>(
      items,
      query,
      tasks.meta.itemCount,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Task returned successfully.',
    type: TaskResponse,
  })
  /**
   * Retrieves a single task by identifier.
   * @param param - Route parameter DTO.
   * @returns Task response payload.
   */
  async findOne(@Param() { id }: UuidParamDto): Promise<TaskResponse> {
    const task = await this.taskService.findOne(id);
    return mapTaskToResponse(task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully.',
    type: TaskResponse,
  })
  /**
   * Updates a task.
   * @param param - Route parameter DTO.
   * @param dto - Update payload.
   * @returns Updated task response.
   */
  async update(
    @Param() { id }: UuidParamDto,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.taskService.update(id, dto);
    return mapTaskToResponse(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiNoContentResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task soft-deleted successfully.',
  })
  /**
   * Soft deletes a task.
   * @param param - Route parameter DTO.
   */
  async remove(@Param() { id }: UuidParamDto): Promise<void> {
    await this.taskService.remove(id);
  }
}
