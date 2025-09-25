import { ApiProperty } from '@nestjs/swagger';

import { CategoryEntity } from '../../categories/entities/category.entity';

export class TaskCategorySummaryResponse {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ nullable: true })
  readonly color?: string | null;

  constructor(category: CategoryEntity) {
    this.id = category.id;
    this.name = category.name;
    this.color = category.color ?? null;
  }
}
