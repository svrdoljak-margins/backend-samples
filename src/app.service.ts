import { Injectable } from '@nestjs/common';
import { IHealthCheckService } from './common/interfaces/health-check.interface';
import { HealthCheckResponse } from './common/responses/health-check.response';

@Injectable()
export class AppService implements IHealthCheckService {
  getHealthCheck(): HealthCheckResponse {
    return new HealthCheckResponse('Base API', 'Base project API', '1.0.0');
  }
}
