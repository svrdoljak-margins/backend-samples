import { ApiProperty } from '@nestjs/swagger';

export class TaskBreakdownUsageResponse {
  @ApiProperty({ description: 'Prompt token count', example: 120 })
  promptTokens!: number;

  @ApiProperty({ description: 'Candidate token count', example: 240 })
  candidateTokens!: number;

  @ApiProperty({ description: 'Total tokens used', example: 360 })
  totalTokens!: number;
}

export const mapUsageToResponse = (
  usage?: Partial<TaskBreakdownUsageResponse>,
): TaskBreakdownUsageResponse => ({
  promptTokens: usage?.promptTokens ?? 0,
  candidateTokens: usage?.candidateTokens ?? 0,
  totalTokens: usage?.totalTokens ?? 0,
});

export class TaskBreakdownResponse {
  @ApiProperty({ type: [String] })
  subtasks!: string[];

  @ApiProperty({ description: 'Model used for generation' })
  model!: string;

  @ApiProperty({ description: 'Timestamp when the plan was generated' })
  generatedAt!: string;

  @ApiProperty({ type: TaskBreakdownUsageResponse })
  usage!: TaskBreakdownUsageResponse;
}

export const buildTaskBreakdownResponse = (init: {
  subtasks: string[];
  model: string;
  generatedAt?: string;
  usage?: Partial<TaskBreakdownUsageResponse>;
}): TaskBreakdownResponse => ({
  subtasks: init.subtasks,
  model: init.model,
  generatedAt: init.generatedAt ?? new Date().toISOString(),
  usage: mapUsageToResponse(init.usage),
});
