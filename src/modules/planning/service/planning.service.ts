import { Injectable, Logger } from '@nestjs/common';

import { LLMGeminiConfig } from '../../../common/config/env.validation';
import { buildTaskBreakdownPrompt } from '../prompts/task-breakdown.prompt';
import { TaskBreakdownRequestDto } from '../dto/task-breakdown-request.dto';
import {
  TaskBreakdownResponse,
  TaskBreakdownUsageResponse,
} from '../responses/task-breakdown.response';
import { GeminiGenerateContentResponse } from '../types/gemini.types';
import { GeminiService } from './gemini.service';

const LIST_PREFIX_PATTERN = /^[\d*).\s-]+/;

@Injectable()
export class PlanningService {
  private readonly logger = new Logger(PlanningService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly geminiConfig: LLMGeminiConfig,
  ) {}

  async generateTaskBreakdown(
    request: TaskBreakdownRequestDto,
  ): Promise<TaskBreakdownResponse> {
    const prompt = buildTaskBreakdownPrompt(request);
    const llmResponse = await this.safeGenerateContent(prompt);

    const finalSubtasks = this.determineSubtasks(request, llmResponse);
    const usage = this.buildUsage(llmResponse);

    return new TaskBreakdownResponse({
      subtasks: finalSubtasks,
      model: this.geminiConfig.MODEL,
      usage,
    });
  }

  private async safeGenerateContent(
    prompt: string,
  ): Promise<GeminiGenerateContentResponse | undefined> {
    try {
      return await this.geminiService.generateContent(prompt);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'LLM integration unavailable';
      this.logger.warn(
        `LLM request failed, falling back to heuristic plan: ${message}`,
      );
      return undefined;
    }
  }

  private determineSubtasks(
    request: TaskBreakdownRequestDto,
    llmResponse?: GeminiGenerateContentResponse,
  ): string[] {
    if (llmResponse) {
      const subtasks = this.extractSubtasks(
        llmResponse,
        request.preferredSubtaskCount ?? 8,
      );

      if (subtasks.length) {
        return subtasks;
      }
    }

    return this.generateFallbackPlan(request.summary, request.categories);
  }

  private buildUsage(
    response?: GeminiGenerateContentResponse,
  ): TaskBreakdownUsageResponse {
    return new TaskBreakdownUsageResponse({
      promptTokens: response?.usageMetadata?.promptTokenCount ?? 0,
      candidateTokens: response?.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: response?.usageMetadata?.totalTokenCount ?? 0,
    });
  }

  private extractSubtasks(
    response: GeminiGenerateContentResponse,
    preferredCount: number,
  ): string[] {
    const candidate = response.candidates?.find((item) =>
      item.content?.parts?.some((part) => part.text?.trim()),
    );

    if (!candidate) {
      return [];
    }

    const combinedText = candidate.content.parts
      .map((part) => part.text ?? '')
      .join('\n');

    if (!combinedText.trim()) {
      return [];
    }

    const potentialLines = combinedText
      .split(/\r?\n/)
      .map((line) =>
        line
          .trim()
          .replace(LIST_PREFIX_PATTERN, '')
          .replace(/^Step\s*\d+:?/i, '')
          .trim(),
      )
      .filter((line) => line.length > 0);

    const unique = Array.from(new Set(potentialLines));

    return unique.slice(0, preferredCount);
  }

  private generateFallbackPlan(
    summary: string,
    categories?: string[],
  ): string[] {
    const basePlan = [
      `Clarify success metrics and acceptance criteria for ${summary}.`,
      `Break down ${summary} into deliverables and milestones with owners.`,
      `Assemble resources, stakeholders, and tooling required for ${summary}.`,
      `Create a schedule with dependencies and risk mitigations for ${summary}.`,
      `Execute deliverables while tracking progress and blockers for ${summary}.`,
      `Review outcomes, collect feedback, and document learnings for ${summary}.`,
    ];

    if (categories?.length) {
      basePlan.splice(
        2,
        0,
        `Align subtasks to focus areas: ${categories.join(', ')} and map owners accordingly.`,
      );
    }

    return basePlan;
  }
}
