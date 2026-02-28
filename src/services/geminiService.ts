/**
 * Frontend Gemini API client — all calls go through the server proxy.
 * API keys NEVER reach the browser.
 */

export interface AssistantResponse {
    text: string;
    action?: string;
    params?: Record<string, string>;
}

/**
 * Get AI assistant guidance via server proxy.
 */
export async function getAssistantGuidance(
    userInput: string,
    currentContext: string,
    language: string,
    userHistory: string[] = []
): Promise<AssistantResponse> {
    try {
        const res = await fetch("/api/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput, currentContext, language, userHistory }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("[geminiService] Assistant call failed:", err);
        return { text: "" };
    }
}

/**
 * Get proactive screen guide narration via server proxy.
 */
export async function getProactiveHelp(
    currentContext: string,
    language: string,
    userHistory: string[] = []
): Promise<AssistantResponse> {
    try {
        const res = await fetch("/api/proactive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentContext, language, userHistory }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("[geminiService] Proactive call failed:", err);
        return { text: "" };
    }
}

/**
 * Analyze a document image via server proxy.
 */
export async function analyzeDocument(
    base64Data: string,
    mimeType: string
): Promise<string> {
    try {
        const res = await fetch("/api/analyze-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Data, mimeType }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.text || "Analysis complete.";
    } catch (err) {
        console.error("[geminiService] Document analysis failed:", err);
        return "Analysis failed. Please try again.";
    }
}

/**
 * Generate an AI poster via server proxy. Returns base64 PNG data.
 */
export async function generatePoster(
    prompt: string,
    aspectRatio: string
): Promise<string | null> {
    try {
        const res = await fetch("/api/generate-poster", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, aspectRatio }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.imageData || null;
    } catch (err) {
        console.error("[geminiService] Poster generation failed:", err);
        return null;
    }
}

/**
 * Text-to-speech via server proxy. Returns base64 WAV audio data.
 */
export async function textToSpeech(
    text: string,
    lang: string
): Promise<string | null> {
    try {
        const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, lang }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.audioData || null;
    } catch (err) {
        console.error("[geminiService] TTS failed:", err);
        return null;
    }
}

/** Reset the server-side chat session */
export function resetChatSession() {
    fetch("/api/reset-session", { method: "POST" }).catch(() => { });
}
