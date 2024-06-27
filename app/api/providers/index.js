import { claudeConfig } from "./claude";
import { openAIConfig } from "./openai";

export const aiProviders = {
  openai: openAIConfig,
  claude: claudeConfig,
  // Add other AI providers here
};
