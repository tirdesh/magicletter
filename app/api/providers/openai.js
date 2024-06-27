import axios from "axios";

export const openAIProvider = {
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
