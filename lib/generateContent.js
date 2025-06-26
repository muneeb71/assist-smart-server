import { anthropic, client, gemini } from "../config/aiClients.js";

export const generateUsingGpt = async (prompt) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });
  console.log(response.output_text);
  return response.output_text;
};

export const generateUsingClaude = async (prompt) => {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 2048,
    system: "Respond with detailed content",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response);

  return response;
};

export const generateUsingGemini = async (prompt) => {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
};
