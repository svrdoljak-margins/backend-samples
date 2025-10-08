import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TaskBreakdownRequestDto } from './dto/task-breakdown-request.dto';
import { TaskBreakdownResponse } from './responses/task-breakdown.response';
import { AbstractPlanningService } from './abstract/planning.abstract.service';

@ApiTags('Planning')
@Controller({ path: 'planning', version: '1' })
export class PlanningController {
  constructor(private readonly planningService: AbstractPlanningService) {}

  @Post('task-breakdown')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a task breakdown plan' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Task breakdown generated successfully.',
    type: TaskBreakdownResponse,
  })
  /**
   * Generates a task breakdown using the planning service.
   * @param request - Request payload containing planning context.
   * @returns Task breakdown response.
   */
  generateTaskBreakdown(
    @Body() request: TaskBreakdownRequestDto,
  ): Promise<TaskBreakdownResponse> {
    return this.planningService.generateTaskBreakdown(request);
  }
}
