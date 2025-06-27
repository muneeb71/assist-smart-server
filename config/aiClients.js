import { OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export const client = new OpenAI({
  apiKey:
    "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",
});

export const anthropic = new Anthropic({
  apiKey:
    "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",
});

export const gemini = new GoogleGenAI({
  apiKey: "AIzaSyCD4nxHWJRrwI7XCFlTEIQ8Kjkbr8YQ6sg",
});
