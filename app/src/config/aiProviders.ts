// src/config/aiProviders.ts

import { AIProviderConfig } from '../model';

const openAIConfig: AIProviderConfig = {
  name: 'openai',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  modelConfig: {
    model: 'gpt-3.5-turbo',
  },
  formatRequest: (prompt: string, text: string) => ({
    model: openAIConfig.modelConfig.model,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ]
  }),
  extractResponse: (response: any) => response.data.choices[0].message.content
};

const claudeConfig: AIProviderConfig = {
  name: 'claude',
  apiUrl: 'https://api.anthropic.com/v1/complete',
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  modelConfig: {
    model: 'claude-v1',
    maxTokens: 1000
  },
  formatRequest: (prompt: string, text: string) => ({
    prompt: `${prompt}\n\nHuman: ${text}\n\nAssistant:`,
    model: claudeConfig.modelConfig.model,
    max_tokens_to_sample: claudeConfig.modelConfig.maxTokens
  }),
  extractResponse: (response: any) => response.data.completion
};

export const aiProviders: { [key: string]: AIProviderConfig } = {
  openai: openAIConfig,
  claude: claudeConfig
};