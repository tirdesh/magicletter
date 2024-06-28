// aiProviders.js
import axios from "axios";

class BaseAIProvider {
  constructor(apiKey, baseURL) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 20000, // 20 seconds timeout
    });
  }
}

class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.openai.com/v1");
  }

  async *processRequestStream(prompt, text) {
    const splitLength = 2000; // Adjust based on your needs
    const parts = this.splitPrompt(text, splitLength);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      try {
        const result = await this.sendRequest(prompt, part.content);
        yield {
          type: "progress",
          data: `Processed part ${i + 1} of ${parts.length}`,
        };
        if (i === parts.length - 1) {
          yield { type: "result", data: result };
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          yield {
            type: "error",
            data: "Rate limit exceeded. Please try again later.",
          };
          return;
        }
        throw error;
      }
    }
  }

  async sendRequest(prompt, text) {
    const response = await this.client.post("/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      max_tokens: 1000, // Adjust as needed
    });
    return response.data.choices[0].message.content;
  }

  splitPrompt(text, splitLength) {
    const numParts = Math.ceil(text.length / splitLength);
    const parts = [];

    for (let i = 0; i < numParts; i++) {
      const start = i * splitLength;
      const end = Math.min((i + 1) * splitLength, text.length);
      let content;

      if (i === numParts - 1) {
        content = `[START PART ${i + 1}/${numParts}]\n${text.slice(
          start,
          end
        )}\n[END PART ${
          i + 1
        }/${numParts}]\nALL PARTS SENT. Now you can continue processing the request.`;
      } else {
        content = `Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "Part ${
          i + 1
        }/${numParts} received" and wait for the next part.\n[START PART ${
          i + 1
        }/${numParts}]\n${text.slice(start, end)}\n[END PART ${
          i + 1
        }/${numParts}]\nRemember not answering yet. Just acknowledge you received this part with the message "Part ${
          i + 1
        }/${numParts} received" and wait for the next part.`;
      }

      parts.push({
        name: `split_${String(i + 1).padStart(3, "0")}_of_${String(
          numParts
        ).padStart(3, "0")}.txt`,
        content: content,
      });
    }

    return parts;
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
