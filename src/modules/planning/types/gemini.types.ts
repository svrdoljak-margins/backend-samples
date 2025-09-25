export interface GeminiContentPart {
  text?: string;
}

export interface GeminiContent {
  role?: string;
  parts: GeminiContentPart[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
}

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  usageMetadata?: GeminiUsageMetadata;
}
