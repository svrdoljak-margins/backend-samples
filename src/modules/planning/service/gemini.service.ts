import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';

import { TaskManagerExternalServiceException } from '../../../common/exceptions/custom.exception';
import { LLMGeminiConfig } from '../../../common/config/env.validation';
import { GeminiGenerateContentResponse } from '../types/gemini.types';

@Injectable()
export class GeminiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly geminiConfig: LLMGeminiConfig,
  ) {}

  async generateContent(
    prompt: string,
  ): Promise<GeminiGenerateContentResponse> {
    const endpoint = `/models/${this.geminiConfig.MODEL}:generateContent?key=${this.geminiConfig.API_KEY}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: this.geminiConfig.TEMPERATURE,
        maxOutputTokens: this.geminiConfig.MAX.OUTPUT.TOKENS,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post<GeminiGenerateContentResponse>(endpoint, payload),
      );

      return response.data;
    } catch (error) {
      const message = this.resolveErrorMessage(error);
      throw new TaskManagerExternalServiceException(
        `Task breakdown generation failed: ${message}`,
      );
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.error?.message ??
        error.response?.statusText ??
        error.message ??
        'Service unavailable'
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unexpected error';
  }
}
