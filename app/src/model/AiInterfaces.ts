export type AIProviderName = "openai" | "claude" | "cohere"; // Add other providers as needed

export interface AIModelConfig {
  model: string;
  maxTokens?: number;
}

export type AIProviderConfig = {
  name: AIProviderName;
  modelConfig: AIModelConfig;
};
