import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LLMGeminiConfig } from 'src/common/config/env.validation';

import { PlanningController } from './planning.controller';
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
  providers: [GeminiService, PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {}
