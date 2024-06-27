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

const aiProviders = {
  openai: openAIProvider,
  claude: claudeProvider,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider, prompt, text } = req.body;

  if (!aiProviders[provider]) {
    return res.status(400).json({ error: "Unsupported AI provider" });
  }

  const config = aiProviders[provider];

  // eslint-disable-next-line no-undef
  const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const result = await config.processRequest(prompt, text, apiKey);
    res.status(200).json({ result });
  } catch (error) {
    console.error(`Error processing text with ${provider}:`, error);
    res.status(500).json({ error: "Error processing request" });
  }
}
