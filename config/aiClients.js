import { OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export const client = new OpenAI({
  apiKey:
    process.env.OPEN_AI_API_KEY,
});
 
export const anthropic = new Anthropic({
  apiKey:
    process.env.ANTHROPIC_API_KEY,
});
 
export const gemini = new GoogleGenAI({
  apiKey: 
    process.env.GOOGLE_GENAI_API_KEY,
});