import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LLMGeminiConfig } from 'src/common/config/env.validation';

import { PlanningController } from './planning.controller';
import { AbstractPlanningService } from './abstract/planning.abstract.service';
import { GeminiService } from './service/gemini.service';
import { PlanningService } from './service/planning.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [LLMGeminiConfig],
      useFactory: (config: LLMGeminiConfig) => ({
        baseURL: config.API_BASE_URL,
        timeout: 10000,
        maxRedirects: 0,
      }),
    }),
  ],
  controllers: [PlanningController],
  providers: [
    GeminiService,
    PlanningService,
    {
      provide: AbstractPlanningService,
      useExisting: PlanningService,
    },
  ],
  exports: [AbstractPlanningService],
})
export class PlanningModule {}
