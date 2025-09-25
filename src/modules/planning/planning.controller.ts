import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TaskBreakdownRequestDto } from './dto/task-breakdown-request.dto';
import { TaskBreakdownResponse } from './responses/task-breakdown.response';
import { PlanningService } from './service/planning.service';

@ApiTags('Planning')
@Controller({ path: 'planning', version: '1' })
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post('task-breakdown')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TaskBreakdownResponse })
  generateTaskBreakdown(
    @Body() request: TaskBreakdownRequestDto,
  ): Promise<TaskBreakdownResponse> {
    return this.planningService.generateTaskBreakdown(request);
  }
}
