import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ICategory } from '../interface/category.interface';

export class CategoryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Display name' })
  name!: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Hex color representation',
    example: '#4F46E5',
  })
  color?: string | null;

  @ApiProperty({ description: 'Number of non-deleted tasks in this category' })
  taskCount!: number;

  @ApiProperty({ type: String, description: 'Creation timestamp' })
  createdAt!: string;

  @ApiProperty({ type: String, description: 'Last update timestamp' })
  updatedAt!: string;
}

export const mapCategoryToResponse = (
  category: ICategory,
): CategoryResponse => ({
  id: category.id,
  name: category.name,
  description: category.description ?? null,
  color: category.color ?? null,
  taskCount: category.taskCount ?? 0,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
});
