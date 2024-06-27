import { AIProviderConfig } from "../model";

export const aiProviders: { [key: string]: AIProviderConfig } = {
  openai: {
    name: "openai",
    modelConfig: {
      model: "gpt-3.5-turbo",
    },
  },
  claude: {
    name: "claude",
    modelConfig: {
      model: "claude-v1",
      maxTokens: 1000,
    },
  },
  // Add other AI providers here
};
