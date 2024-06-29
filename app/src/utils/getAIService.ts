// src/utils/getAIService.ts

import { aiProviders } from "@/config/aiProviders";
import AIService from "@/services/AIService";

export type AIProviderName = "openai" | "claude";

export function getAIService(providerName: AIProviderName): AIService {
  const providerConfig = aiProviders[providerName];
  if (!providerConfig) {
    throw new Error(`Unsupported AI provider: ${providerName}`);
  }

  return new AIService(providerName);
}
