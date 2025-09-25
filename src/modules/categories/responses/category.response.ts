import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CategoryEntity } from '../entities/category.entity';

export class CategoryResponse {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ description: 'Display name' })
  readonly name: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  readonly description?: string | null;

  @ApiPropertyOptional({
    description: 'Hex color representation',
    example: '#4F46E5',
  })
  readonly color?: string | null;

  @ApiProperty({ description: 'Number of non-deleted tasks in this category' })
  readonly taskCount: number;

  @ApiProperty({ type: String, description: 'Creation timestamp' })
  readonly createdAt: string;

  @ApiProperty({ type: String, description: 'Last update timestamp' })
  readonly updatedAt: string;

  constructor(category: CategoryEntity) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description ?? null;
    this.color = category.color ?? null;
    this.taskCount = category.taskCount ?? 0;
    this.createdAt = category.createdAt.toISOString();
    this.updatedAt = category.updatedAt.toISOString();
  }
}
