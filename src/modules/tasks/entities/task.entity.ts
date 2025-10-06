import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

import { CategoryEntity } from '../../categories/entities/category.entity';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

const numericColumnTransformer: ValueTransformer = {
  to: (value?: number | null) => value ?? null,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Backlog })
  status!: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.Medium })
  priority!: TaskPriority;

  @Column({
    type: 'timestamp with time zone',
    name: 'start_date',
    nullable: true,
  })
  startDate?: Date | null;

  @Column({
    type: 'timestamp with time zone',
    name: 'due_date',
    nullable: true,
  })
  dueDate?: Date | null;

  @Column({
    type: 'numeric',
    name: 'estimated_hours',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericColumnTransformer,
  })
  estimatedHours?: number | null;

  @Column({
    type: 'numeric',
    name: 'actual_hours',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericColumnTransformer,
  })
  actualHours?: number | null;

  @Column({ type: 'smallint', default: 0 })
  progress!: number;

  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.tasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;
}
