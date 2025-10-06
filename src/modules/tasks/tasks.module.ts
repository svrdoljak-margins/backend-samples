import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../categories/entities/category.entity';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './tasks.controller';
import { AbstractTaskRepository } from './abstract/task.abstract.repository';
import { AbstractTaskService } from './abstract/task.abstract.service';
import { TaskRepository } from './service/task.repository';
import { TaskService } from './service/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, CategoryEntity])],
  controllers: [TaskController],
  providers: [
    TaskRepository,
    TaskService,
    {
      provide: AbstractTaskRepository,
      useExisting: TaskRepository,
    },
    {
      provide: AbstractTaskService,
      useExisting: TaskService,
    },
  ],
  exports: [AbstractTaskService],
})
export class TaskModule {}
