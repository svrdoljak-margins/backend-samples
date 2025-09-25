import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../categories/entities/category.entity';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './tasks.controller';
import { TaskService } from './service/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, CategoryEntity])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
