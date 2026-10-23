import { createOpenAI } from "@ai-sdk/openai"

// Use OpenAI directly instead of OpenRouter
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// For backward compatibility, export as openrouter
export const openrouter = openai

export function getModelId() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini"
}
