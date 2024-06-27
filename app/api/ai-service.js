import axios from "axios";
import { aiProviders } from "./providers";

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
    const client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const requestData = config.formatRequest(prompt, text);
    const response = await client.post("", requestData);
    const result = config.extractResponse(response);

    res.status(200).json({ result });
  } catch (error) {
    console.error(`Error processing text with ${provider}:`, error);
    res.status(500).json({ error: "Error processing request" });
  }
}
