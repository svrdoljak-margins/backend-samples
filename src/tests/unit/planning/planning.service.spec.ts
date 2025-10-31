import 'reflect-metadata';

import { PlanningService } from '../../../modules/planning/service/planning.service';
import { GeminiService } from '../../../modules/planning/service/gemini.service';
import { TaskBreakdownRequestDto } from '../../../modules/planning/dto/task-breakdown-request.dto';
import { GeminiGenerateContentResponse } from '../../../modules/planning/types/gemini.types';
import { LLMGeminiConfig } from '../../../common/config/env.validation';

const mockConfig: LLMGeminiConfig = {
  API_BASE_URL: 'https://example.com',
  API_KEY: 'test-key',
  MODEL: 'models/gemini-test',
  TEMPERATURE: 0.3,
  MAX: {
    OUTPUT: {
      TOKENS: 512,
    },
  },
};

describe('PlanningService', () => {
  let planningService: PlanningService;
  let geminiService: jest.Mocked<GeminiService>;

  beforeEach(() => {
    geminiService = {
      generateContent: jest.fn(),
    } as unknown as jest.Mocked<GeminiService>;

    planningService = new PlanningService(geminiService, mockConfig);
  });

  const request: TaskBreakdownRequestDto = {
    summary: 'Launch new website',
    preferredSubtaskCount: 3,
  };

  it('parses subtasks returned by Gemini and maps usage metadata', async () => {
    const llmResponse: GeminiGenerateContentResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: '1. Design wireframes\n2. Set up hosting\n3. Implement frontend',
              },
            ],
          },
        },
      ],
      usageMetadata: {
        promptTokenCount: 42,
        candidatesTokenCount: 100,
        totalTokenCount: 142,
      },
    };

    geminiService.generateContent.mockResolvedValue(llmResponse);

    const response = await planningService.generateTaskBreakdown(request);

    expect(response.subtasks).toEqual([
      'Design wireframes',
      'Set up hosting',
      'Implement frontend',
    ]);
    expect(response.model).toBe(mockConfig.MODEL);
    expect(response.usage.promptTokens).toBe(42);
    expect(response.usage.totalTokens).toBe(142);
  });

  it('falls back to heuristic plan when Gemini call fails', async () => {
    geminiService.generateContent.mockRejectedValue(
      new Error('network failure'),
    );

    const response = await planningService.generateTaskBreakdown(request);

    expect(response.subtasks.length).toBeGreaterThan(0);
    expect(response.subtasks[0]).toContain('Clarify success metrics');
    expect(response.model).toBe(mockConfig.MODEL);
    expect(response.usage.totalTokens).toBe(0);
  });
});
