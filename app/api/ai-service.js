import axios from "axios";

const openAIProvider = {
  apiUrl: "https://api.openai.com/v1/chat/completions",

  formatRequest: (prompt, text) => ({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
  }),

  extractResponse: (response) => response.data.choices[0].message.content,

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

const claudeProvider = {
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

export const aiProviders = {
  openai: openAIProvider,
  claude: claudeProvider,
};
