import { ApiProperty } from '@nestjs/swagger';

import { ITaskCategorySummary } from '../interface/task.interface';

export class TaskCategorySummaryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  color?: string | null;
}

export const mapTaskCategoryToResponse = (
  category: ITaskCategorySummary,
): TaskCategorySummaryResponse => ({
  id: category.id,
  name: category.name,
  color: category.color ?? null,
});
