import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { LanguageCode, LANGUAGES } from "../types";
import { getRotatedAIClient } from "./apiClient";

export interface AssistantResponse {
  text: string;
  action?: string;
  params?: any;
}

// Store chat history in memory instead of the chatSession object to allow key rotation
let chatHistory: any[] = [];

export function resetChatSession() {
  chatHistory = [];
}

export async function getAssistantGuidance(
  userInput: string,
  currentContext: string,
  language: LanguageCode = "hi",
  userHistory: string[] = []
): Promise<AssistantResponse> {
  const languageName = LANGUAGES.find(l => l.code === language)?.name || "Hindi";
  const ai = getRotatedAIClient();
  
  const systemInstruction = `
    You are SUVIDHA, an advanced AI Smart Urban Digital Helpdesk Assistant.
    Your goal is to provide a seamless, agent-like experience for citizens.
    
    CONTEXT:
    - Current Screen: ${currentContext}
    - Language: ${languageName} (Respond in this language)
    - User History: ${userHistory.slice(-10).join("\n")}

    CAPABILITIES:
    - You can navigate the user through the kiosk using actions.
    - You can handle complex, multi-turn queries about civic services.
    - You can proactively suggest the next steps.
    - You are extremely polite, patient, and helpful (especially to elderly users).

    ACTIONS:
    - navigate_to_login: Use when user wants to start or sign in.
    - navigate_to_dashboard: Use when user is logged in and wants to see services.
    - navigate_to_waste_dashboard: Use when user wants to see waste management services specifically.
    - navigate_to_service (params: { serviceId: string }): Use to go to a specific service.
    - navigate_to_status: Use when user wants to check their application status.
    - navigate_to_welcome: Use to go back to the start.
    - go_back: Use to return to the previous screen.

    GUIDELINES:
    1. If the user is on the Login screen, guide them to enter their Aadhaar number using the keypad.
    2. If the user is on the Dashboard, explain the available services briefly.
    3. If the user is in a Service Detail, explain what documents they need to upload.
    4. Always maintain a conversational tone. If the user says "Thank you", respond warmly.
    5. If the user is confused, offer to explain the current screen in detail.
    6. IMPORTANT: You MUST respond in ${languageName}.

    Respond ONLY in JSON format:
    {
      "text": "Your spoken response in ${languageName}",
      "action": "action_name",
      "params": { "key": "value" }
    }
  `;

  try {
    // Use generateContent instead of chat.sendMessage to allow easy key rotation per request
    // We pass the history manually
    const contents = [
      ...chatHistory,
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);
    
    // Update history
    chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
    chatHistory.push({ role: 'model', parts: [{ text: resultText }] });
    
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback with rotated client
    const fallbackAi = getRotatedAIClient();
    const fallback = await fallbackAi.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: userInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(fallback.text || "{}");
  }
}

export async function getProactiveHelp(
  currentContext: string,
  language: LanguageCode = "hi",
  userHistory: string[] = []
): Promise<AssistantResponse> {
  const languageName = LANGUAGES.find(l => l.code === language)?.name || "Hindi";
  const ai = getRotatedAIClient();

  const systemInstruction = `
    You are SUVIDHA. The user just arrived at the ${currentContext} screen.
    Provide a proactive, welcoming, and helpful message.
    Language: ${languageName} (Respond in this language)
    User History: ${userHistory.slice(-5).join(", ")}

    GUIDELINES:
    1. If the user history shows they were just looking at a specific service, mention it.
    2. Be brief and encouraging.
    3. If they just logged in, welcome them by name if possible.
    4. IMPORTANT: You MUST respond in ${languageName}.

    Respond ONLY in JSON format:
    {
      "text": "The proactive spoken message in ${languageName}"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Generate a proactive help message based on the current context and history.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { text: "" };
  }
}
