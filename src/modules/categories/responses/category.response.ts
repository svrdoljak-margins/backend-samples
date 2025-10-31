import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponse {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @Expose()
  @ApiProperty({ description: 'Display name' })
  name!: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Detailed description' })
  description?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Hex color representation',
    example: '#4F46E5',
  })
  color?: string | null;

  @Expose()
  @ApiProperty({ description: 'Number of non-deleted tasks in this category' })
  taskCount!: number;

  @Expose()
  @ApiProperty({ type: String, description: 'Creation timestamp' })
  createdAt!: string;

  @Expose()
  @ApiProperty({ type: String, description: 'Last update timestamp' })
  updatedAt!: string;
}
