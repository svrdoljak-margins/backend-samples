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

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse } from './responses/task.response';
import { TaskService } from './service/task.service';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({ type: TaskResponse })
  create(@Body() dto: CreateTaskDto): Promise<TaskResponse> {
    return this.taskService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(TaskResponse)
  findAll(
    @Query() query: TaskQueryDto,
  ): Promise<PaginationModel<TaskResponse>> {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskResponse })
  findOne(@Param('id') id: string): Promise<TaskResponse> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskResponse })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Task soft-deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.taskService.remove(id);
  }
}
