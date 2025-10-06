import { TaskBreakdownRequestDto } from '../dto/task-breakdown-request.dto';
import { TaskBreakdownResponse } from '../responses/task-breakdown.response';

/** Contract for planning features that produce task breakdowns. */
export abstract class AbstractPlanningService {
  /** Generates a task breakdown for the supplied request. */
  abstract generateTaskBreakdown(
    request: TaskBreakdownRequestDto,
  ): Promise<TaskBreakdownResponse>;
}
