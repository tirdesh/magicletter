/* eslint-disable no-undef */
import { createAIProvider } from "../aiProviders.js";

export const config = {
  runtime: "edge",
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
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiProvider.processRequestStream(
          prompt,
          text
        )) {
          controller.enqueue(JSON.stringify(chunk) + "\n");
        }
      } catch (error) {
        controller.enqueue(
          JSON.stringify({ type: "error", data: error.message }) + "\n"
        );
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
