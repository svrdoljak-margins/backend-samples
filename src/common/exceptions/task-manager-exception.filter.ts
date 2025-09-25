import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { TaskManagerException } from './custom.exception';

@Catch(TaskManagerException)
export class TaskManagerExceptionFilter
  implements ExceptionFilter<TaskManagerException>
{
  private readonly logger = new Logger(TaskManagerExceptionFilter.name);

  catch(exception: TaskManagerException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.exceptionInfo.status
      ? Number(exception.exceptionInfo.status)
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = {
      statusCode: status,
      error: exception.exceptionName,
      message: exception.exceptionInfo.detail,
      code: exception.exceptionInfo.code,
    };

    this.logger.warn(
      `${exception.exceptionName}: ${exception.exceptionInfo.detail ?? exception.message ?? 'Unhandled error'}`,
    );

    response.status(status).json(body);
  }
}
