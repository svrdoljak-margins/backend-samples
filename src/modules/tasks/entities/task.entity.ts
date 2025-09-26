import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.tasks)
  category?: CategoryEntity | null;
}
