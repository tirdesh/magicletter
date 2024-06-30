// src/utils/getAIService.ts

import { aiProviders } from "@/config/aiProviders";
import { AIProviderName } from "@/model";
import AIService from "@/services/AIService";

export function getAIService(providerName: AIProviderName): AIService {
  console.log(
    `Using AI provider: ${providerName} from AIProviders: ${aiProviders}`
  );
  const providerConfig = aiProviders[providerName];
  if (!providerConfig) {
    throw new Error(`Unsupported AI provider: ${providerName}`);
  }

  return new AIService(providerName);
}
