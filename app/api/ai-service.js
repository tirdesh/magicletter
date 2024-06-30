// api/ai-service.js
/* eslint-disable no-undef */
import axios from "axios";

export const config = {
  runtime: "edge",
};

// Base AI Provider
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

// OpenAI Provider
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

// Cohere Provider
class CohereProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.cohere.ai/v1");
  }

  async processRequest(prompt, text) {
    const response = await this.client.post("/generate", {
      model: "command",
      prompt: `${prompt}\n\nHuman: ${text}\nAI:`,
      max_tokens: 300,
      temperature: 0.7,
      k: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });
    return response.data.generations[0].text;
  }
}

// Claude Provider
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

// Factory function to create AI providers
const createAIProvider = (provider, apiKey) => {
  switch (provider) {
    case "openai":
      return new OpenAIProvider(apiKey);
    case "cohere":
      return new CohereProvider(apiKey);
    case "claude":
      return new ClaudeProvider(apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};

// Main handler function
export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { provider, prompt, text } = await req.json();

    let apiKey;
    switch (provider) {
      case "openai":
        apiKey = process.env.OPENAI_API_KEY ?? "";
        break;
      case "cohere":
        apiKey = process.env.COHERE_API_KEY ?? "";
        break;
      case "claude":
        apiKey = process.env.CLAUDE_API_KEY ?? "";
        break;
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    if (!apiKey) {
      throw new Error(`API key not configured for provider: ${provider}`);
    }

    const aiProvider = createAIProvider(provider, apiKey);
    const result = await aiProvider.processRequest(prompt, text);

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Error processing request",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
