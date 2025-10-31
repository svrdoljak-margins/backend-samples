import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ExceptionName } from 'src/common/exceptions/custom.exception.enum';
import { ICustomExceptionInfo } from 'src/common/exceptions/exception-info.interface';

import { HealthCheckResponse } from '../../common/responses/health-check.response';
import { AppService } from './app.service';

@Controller({
  version: VERSION_NEUTRAL,
})
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get health check information' })
  @ApiOkResponse({
    status: 200,
    description: 'Health check information',
    type: HealthCheckResponse,
  })
  /**
   * Returns basic health information for monitoring.
   * @returns Health check payload.
   */
  getHealthCheck(): HealthCheckResponse {
    return this.appService.getHealthCheck();
  }

  @Get('/exceptions')
  @ApiOperation({
    summary: 'Get exception metadata',
    description:
      'Note: This endpoint is available only in development environment',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Exception metadata',
  })
  /**
   * Exposes metadata for custom exceptions (development only).
   * @returns Exception metadata keyed by exception name.
   */
  getExceptionMetadata(): Record<ExceptionName, ICustomExceptionInfo> {
    return this.appService.getExceptionMetadata();
  }
}
