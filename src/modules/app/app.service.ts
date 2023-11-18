import { Injectable } from '@nestjs/common';

import { ProjectConfig } from 'src/common/config/env.validation';

import { IHealthCheckService } from '../../common/interfaces/health-check.interface';
import { HealthCheckResponse } from '../../common/responses/health-check.response';

@Injectable()
export class AppService implements IHealthCheckService {
  constructor(private readonly project: ProjectConfig) {}

  /**
   * Returns basic API data.
   */
  getHealthCheck(): HealthCheckResponse {
    return new HealthCheckResponse(
      this.project.NAME,
      this.project.DESCRIPTION,
      this.project.VERSION,
    );
  }
}
