import * as aiProviders from "./providers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider, prompt, text } = req.body;
  const providerKey = `${provider}Provider`;

  if (!aiProviders[providerKey]) {
    return res.status(400).json({ error: "Unsupported AI provider" });
  }

  const config = aiProviders[providerKey];
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
