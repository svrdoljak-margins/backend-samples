import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckResponse } from '../../common/responses/health-check.response';

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
  getHealthCheck(): HealthCheckResponse {
    return this.appService.getHealthCheck();
  }
}
