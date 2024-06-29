// src/services/AIService.ts
import { aiProviders } from "@/config/aiProviders";
import { AIProviderConfig, AIProviderName } from "@/model/AiInterfaces";
import axios from "axios";

export default class AIService {
  private config: AIProviderConfig;

  constructor(providerName: AIProviderName) {
    this.config = aiProviders[providerName];
    if (!this.config) {
      throw new Error(`Unsupported AI provider: ${providerName}`);
    }
  }

  async processText(prompt: string, text: string): Promise<string> {
    try {
      const response = await axios.post("/api/ai-service", {
        provider: this.config.name,
        prompt,
        text,
      });
      return response.data.result;
    } catch (error) {
      console.error(`Error processing text with ${this.config.name}:`, error);
      throw error;
    }
  }
}
