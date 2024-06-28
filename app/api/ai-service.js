/* eslint-disable no-undef */
export const config = {
  runtime: "edge",
};

class BaseAIProvider {
  constructor(apiKey, baseURL) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
      }
    }
  }
}

class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.openai.com/v1");
    this.splitLength = 3500; // Increased split size
  }

  async *processRequestStream(prompt, text) {
    const parts = this.splitPrompt(text, this.splitLength);
    let accumulatedResponse = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      try {
        const result = await this.sendRequest(
          prompt,
          part.content,
          i === parts.length - 1
        );
        accumulatedResponse += result;
        yield {
          type: "progress",
          data: `Processed part ${i + 1} of ${parts.length}`,
        };
        if (i === parts.length - 1) {
          yield { type: "result", data: accumulatedResponse.trim() };
        }
      } catch (error) {
        if (error.message.includes("429")) {
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

  async sendRequest(prompt, text, isFinalPart) {
    const messages = [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ];

    if (!isFinalPart) {
      messages.push({
        role: "user",
        content: "Please continue with the next part.",
      });
    }

    const response = await this.fetchWithRetry(
      `${this.baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 4096,
        }),
      }
    );
    return response.choices[0].message.content;
  }

  splitPrompt(text, splitLength) {
    const numParts = Math.ceil(text.length / splitLength);
    const parts = [];

    for (let i = 0; i < numParts; i++) {
      const start = i * splitLength;
      const end = Math.min((i + 1) * splitLength, text.length);
      let content;

      if (i === 0) {
        content = `This is part 1 of ${numParts}. Please process this part and wait for the next part before generating the final response.\n\n${text.slice(
          start,
          end
        )}`;
      } else if (i === numParts - 1) {
        content = `This is the final part (part ${numParts} of ${numParts}). Please process this part and generate the final response.\n\n${text.slice(
          start,
          end
        )}`;
      } else {
        content = `This is part ${
          i + 1
        } of ${numParts}. Please process this part and wait for the next part before generating the final response.\n\n${text.slice(
          start,
          end
        )}`;
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

  async *processRequestStream(prompt, text) {
    try {
      const result = await this.sendRequest(prompt, text);
      yield { type: "result", data: result };
    } catch (error) {
      if (error.message.includes("429")) {
        yield {
          type: "error",
          data: "Rate limit exceeded. Please try again later.",
        };
      } else {
        throw error;
      }
    }
  }

  async sendRequest(prompt, text) {
    const response = await this.fetchWithRetry(`${this.baseURL}/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `${prompt}\n\nHuman: ${text}\nAI:`,
        max_tokens: 300,
      }),
    });
    return response.generations[0].text;
  }
}

class ClaudeProvider extends BaseAIProvider {
  constructor(apiKey) {
    super(apiKey, "https://api.anthropic.com/v1");
  }

  async *processRequestStream(prompt, text) {
    try {
      const result = await this.sendRequest(prompt, text);
      yield { type: "result", data: result };
    } catch (error) {
      if (error.message.includes("429")) {
        yield {
          type: "error",
          data: "Rate limit exceeded. Please try again later.",
        };
      } else {
        throw error;
      }
    }
  }

  async sendRequest(prompt, text) {
    const response = await this.fetchWithRetry(`${this.baseURL}/complete`, {
      method: "POST",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-2",
        prompt: `${prompt}\n\nHuman: ${text}\nAssistant:`,
        max_tokens_to_sample: 300,
      }),
    });
    return response.completion;
  }
}

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

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

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
      return new Response(
        JSON.stringify({ error: "Unsupported AI provider" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const aiProvider = createAIProvider(provider, apiKey);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiProvider.processRequestStream(
          prompt,
          text
        )) {
          const bytes = encoder.encode(JSON.stringify(chunk) + "\n");
          controller.enqueue(bytes);
        }
      } catch (error) {
        const errorBytes = encoder.encode(
          JSON.stringify({ type: "error", data: error.message }) + "\n"
        );
        controller.enqueue(errorBytes);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
