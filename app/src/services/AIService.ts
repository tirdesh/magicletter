// src/services/AIService.ts

import { aiProviders } from "@/config/aiProviders";
import { AIProviderConfig } from "@/model/AiInterfaces";
import axios, { AxiosInstance } from "axios";

export default class AIService {
  private client: AxiosInstance;
  private config: AIProviderConfig;

  constructor(providerName: string) {
    this.config = aiProviders[providerName];
    if (!this.config) {
      throw new Error(`Unsupported AI provider: ${providerName}`);
    }

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async processText(prompt: string, text: string): Promise<string> {
    try {
      const requestData = this.config.formatRequest(prompt, text);
      const response = await this.client.post("", requestData);
      return this.config.extractResponse(response);
    } catch (error) {
      console.error(`Error processing text with ${this.config.name}:`, error);
      throw error;
    }
  }
}
