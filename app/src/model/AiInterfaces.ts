// src/model/AiInterfaces.ts
export interface AIProvider {
    name: 'cohere' | 'openai' | 'claude';
    apiUrl: string;
    apiKey: string;
  }
  
  export interface AIModelConfig {
    model: string;
    maxTokens?: number;
  }
  
  export type AIProviderConfig = {
    name: 'cohere' | 'openai' | 'claude';
    apiUrl: string;
    apiKey: string;
    modelConfig: AIModelConfig;
    formatRequest: (prompt: string, text: string) => any;
    extractResponse: (response: any) => string;
  };
  