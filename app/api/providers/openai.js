export const openAIConfig = {
  apiUrl: "https://api.openai.com/v1/chat/completions",
  formatRequest: (prompt, text) => ({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
  }),
  extractResponse: (response) => response.data.choices[0].message.content,
};
