/* eslint-disable no-undef */
import { createAIProvider } from "./aiProviders.js";

export const config = {
  runtime: "vercel-edge@1.0.0",
};

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
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
