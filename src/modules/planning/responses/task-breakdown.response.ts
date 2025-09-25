import { ApiProperty } from '@nestjs/swagger';

export class TaskBreakdownUsageResponse {
  @ApiProperty({ description: 'Prompt token count', example: 120 })
  readonly promptTokens: number;

  @ApiProperty({ description: 'Candidate token count', example: 240 })
  readonly candidateTokens: number;

  @ApiProperty({ description: 'Total tokens used', example: 360 })
  readonly totalTokens: number;

  constructor(data?: Partial<TaskBreakdownUsageResponse>) {
    this.promptTokens = data?.promptTokens ?? 0;
    this.candidateTokens = data?.candidateTokens ?? 0;
    this.totalTokens = data?.totalTokens ?? 0;
  }
}

export class TaskBreakdownResponse {
  @ApiProperty({ type: [String] })
  readonly subtasks: string[];

  @ApiProperty({ description: 'Model used for generation' })
  readonly model: string;

  @ApiProperty({ description: 'Timestamp when the plan was generated' })
  readonly generatedAt: string;

  @ApiProperty({ type: TaskBreakdownUsageResponse })
  readonly usage: TaskBreakdownUsageResponse;

  constructor(init: {
    subtasks: string[];
    model: string;
    generatedAt?: string;
    usage?: TaskBreakdownUsageResponse;
  }) {
    this.subtasks = init.subtasks;
    this.model = init.model;
    this.generatedAt = init.generatedAt ?? new Date().toISOString();
    this.usage = init.usage ?? new TaskBreakdownUsageResponse();
  }
}
