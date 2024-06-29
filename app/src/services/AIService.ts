import { aiProviders } from "@/config/aiProviders";
import { AIProviderConfig, AIProviderName } from "@/model/AiInterfaces";

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
      const response = await fetch("/api/ai-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: this.config.name,
          prompt,
          text,
        }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let finalResult = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const event = JSON.parse(line);
            switch (event.type) {
              case "progress":
                console.log("Progress:", event.data);
                // You can emit an event or update UI to show progress
                break;
              case "result":
                console.log("Partial result received:", event.data);
                finalResult += event.data;
                break;
              case "error":
                console.error("Error:", event.data);
                throw new Error(event.data);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

      console.log("Final complete result:", finalResult);
      return finalResult;
    } catch (error) {
      console.error(`Error processing text with ${this.config.name}:`, error);
      throw error;
    }
  }
}
