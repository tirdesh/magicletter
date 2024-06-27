import axios from "axios";

export const claudeProvider = {
  apiUrl: "https://api.anthropic.com/v1/complete",

  formatRequest: (prompt, text) => ({
    prompt: `${prompt}\n\nHuman: ${text}\n\nAssistant:`,
    model: "claude-v1",
    max_tokens_to_sample: 1000,
  }),

  extractResponse: (response) => response.data.completion,

  async processRequest(prompt, text, apiKey) {
    const client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const requestData = this.formatRequest(prompt, text);
    const response = await client.post("", requestData);
    return this.extractResponse(response);
  },
};
