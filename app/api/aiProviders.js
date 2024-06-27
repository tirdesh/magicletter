import axios from "axios";

class BaseAIProvider {
  constructor(apiKey, baseURL) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    });
  }
}

class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.openai.com/v1");
  }

  async processRequest(prompt, text) {
    const response = await this.client.post("/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
    });
    return response.data.choices[0].message.content;
  }
}

class CohereProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.cohere.ai/v1");
  }

  async processRequest(prompt, text) {
    const response = await this.client.post("/generate", {
      model: "command",
      prompt: `${prompt}\n\nHuman: ${text}\nAI:`,
      max_tokens: 300,
    });
    return response.data.generations[0].text;
  }
}

class ClaudeProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.anthropic.com/v1");
  }

  async processRequest(prompt, text) {
    const response = await this.client.post("/complete", {
      model: "claude-2",
      prompt: `${prompt}\n\nHuman: ${text}\nAssistant:`,
      max_tokens_to_sample: 300,
    });
    return response.data.completion;
  }
}

// Add more providers as needed...

export const createAIProvider = (provider, apiKey) => {
  switch (provider) {
    case "openai":
      return new OpenAIProvider(apiKey);
    case "cohere":
      return new CohereProvider(apiKey);
    case "claude":
      return new ClaudeProvider(apiKey);
    // Add more cases for other providers
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};
