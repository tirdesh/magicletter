export const claudeConfig = {
  apiUrl: "https://api.anthropic.com/v1/complete",
  formatRequest: (prompt, text) => ({
    prompt: `${prompt}\n\nHuman: ${text}\n\nAssistant:`,
    model: "claude-v1",
    max_tokens_to_sample: 1000,
  }),
  extractResponse: (response) => response.data.completion,
};
