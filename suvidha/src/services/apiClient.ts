import { GoogleGenAI } from "@google/genai";

// Get keys from environment variables
// Supports GEMINI_API_KEY (single) or GEMINI_API_KEYS (comma-separated list)
const getApiKeys = (): string[] => {
  const singleKey = process.env.GEMINI_API_KEY;
  const multipleKeys = process.env.GEMINI_API_KEYS;

  const keys: string[] = [];
  
  if (multipleKeys) {
    keys.push(...multipleKeys.split(',').map(k => k.trim()).filter(k => k !== ''));
  } else if (singleKey) {
    keys.push(singleKey);
  }

  return keys.length > 0 ? keys : [""];
};

const API_KEYS = getApiKeys();
let currentIndex = 0;

/**
 * Returns a new GoogleGenAI instance using the next API key in the rotation.
 * Implements a simple round-robin algorithm.
 */
export function getRotatedAIClient(): GoogleGenAI {
  const apiKey = API_KEYS[currentIndex];
  
  // Advance index for next call
  currentIndex = (currentIndex + 1) % API_KEYS.length;
  
  return new GoogleGenAI({ apiKey });
}

/**
 * Returns the current API key being used (useful for direct fetch calls like Veo)
 */
export function getCurrentApiKey(): string {
  return API_KEYS[currentIndex];
}
