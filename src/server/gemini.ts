import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Server-side Gemini API service.
 * API keys stay here and NEVER reach the browser.
 * The frontend calls /api/* routes which proxy through here.
 */

function getApiKeys(): string[] {
    const multipleKeys = process.env.GEMINI_API_KEYS;
    const singleKey = process.env.GEMINI_API_KEY;

    if (multipleKeys) {
        return multipleKeys.split(",").map(k => k.trim()).filter(Boolean);
    }
    if (singleKey) {
        return [singleKey];
    }
    return [];
}

const API_KEYS = getApiKeys();
let currentIndex = 0;

function getClient(): GoogleGenAI {
    if (API_KEYS.length === 0) {
        throw new Error("No Gemini API keys configured. Set GEMINI_API_KEY or GEMINI_API_KEYS in .env.local");
    }
    const key = API_KEYS[currentIndex];
    currentIndex = (currentIndex + 1) % API_KEYS.length;
    return new GoogleGenAI({ apiKey: key });
}

/** Chat history stored server-side per session (single kiosk) */
let chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

export function resetServerChatSession() {
    chatHistory = [];
}

/** Rich screen descriptions for the proactive narrative guide */
const SCREEN_GUIDE: Record<string, string> = {
    welcome: `The user is on the WELCOME screen — the starting point. 
        Shows SUVIDHA branding, current time, and a "Touch to Start" button.
        Guide them to touch the button. Be welcoming and assure them it's simple and secure.`,
    login: `The user is on the AADHAAR LOGIN screen.
        They enter their 12-digit Aadhaar number using the on-screen keypad.
        Explain that Aadhaar is for verification and their data is secure.
        The CLEAR button resets input. 12 digits activates "Verify & Login".`,
    dashboard: `The user is on the SERVICES DASHBOARD.
        Available services: Electricity, Water, Gas Bookings, Waste Management, e-Sushrut Health, e-Pramaan Certificates.
        Clicking any service card opens a SUB-SERVICE dashboard at /{serviceId} with specific options.
        "Track Application" checks previous requests. "Create Poster" opens AI poster generator.`,
    service_dashboard: `The user is on a SERVICE SUB-DASHBOARD showing sub-service cards.
        Each service has 3 specific sub-services to choose from (e.g., New Connection, Bill Payment, Complaint).
        The user should tap on the specific sub-service they need.
        Each sub-service card navigates to /{serviceId}/{subServiceId} for the application form.
        Guide the user to select the right sub-service based on their need.`,
    service_detail: `The user is on a SUB-SERVICE DETAIL page with an application form.
        They can upload a supporting document (max 5MB). AI analyzes it automatically.
        Then they submit. Explain each step clearly.
        The header shows which specific sub-service they selected.`,
    status: `The user is on APPLICATION STATUS TRACKING.
        Shows a timeline: Submitted → Verification → Field Inspection → Final Approval.
        Blue = active, green = complete, gray = pending. Reassure them.`,
    success: `The user is on SUCCESS CONFIRMATION.
        Request submitted! QR code to scan for receipt. Print/Download buttons available.
        Auto-redirects to welcome after countdown. Congratulate them.`,
    creative: `AI POSTER GENERATOR.
        Type a topic, pick aspect ratio, AI generates a civic awareness poster.
        Explain ratios and encourage descriptive topics.`,
};

interface AssistantRequest {
    userInput: string;
    currentContext: string;
    language: string;
    userHistory: string[];
}

interface ProactiveRequest {
    currentContext: string;
    language: string;
    userHistory: string[];
}

interface DocumentAnalysisRequest {
    base64Data: string;
    mimeType: string;
}

interface PosterRequest {
    prompt: string;
    aspectRatio: string;
}

interface TTSRequest {
    text: string;
    lang: string;
}

const LANGUAGE_MAP: Record<string, string> = {
    en: "English", hi: "Hindi", bn: "Bengali", te: "Telugu",
    mr: "Marathi", ta: "Tamil", gu: "Gujarati", kn: "Kannada",
    ml: "Malayalam", pa: "Punjabi",
};

/** Handle /api/assistant — conversational AI guidance */
export async function handleAssistantGuidance(body: AssistantRequest) {
    const { userInput, currentContext, language, userHistory } = body;
    const languageName = LANGUAGE_MAP[language] || "Hindi";
    const ai = getClient();

    const systemInstruction = `
    You are SUVIDHA, an AI Smart Urban Digital Helpdesk Assistant for an Indian government e-governance kiosk.
    CONTEXT: Screen: ${currentContext}, Language: ${languageName}
    User History: ${userHistory.slice(-10).join("\n")}

    CAPABILITIES: Navigate the kiosk, handle civic service queries, suggest next steps.
    Be polite, patient, helpful (especially for elderly users).

    ═══════ APPLICATION ARCHITECTURE ═══════

    The kiosk has a TWO-LEVEL service navigation:
    Level 1: Main Dashboard → Service Dashboard (e.g., /electricity, /waste)
    Level 2: Service Dashboard → Sub-Service Form (e.g., /electricity/new-connection, /waste/collection)

    ROUTES MAP:
    /             → Welcome screen (Touch to Start)
    /login        → Aadhaar/Phone login
    /dashboard    → Main services dashboard (6 service cards)
    /status       → Application status tracking
    /success      → Submission confirmation
    /creative     → AI poster generator
    /{serviceId}  → Service sub-dashboard (shows 3 sub-service cards)
    /{serviceId}/{subServiceId} → Sub-service detail form (document upload + submit)

    ═══════ NAVIGATION ACTIONS ═══════

    GENERAL NAVIGATION:
    - navigate_to_login: When user wants to start, sign in, or log in.
    - navigate_to_dashboard: When user wants to see all services or go to the main menu.
    - navigate_to_creative: When user wants to create a poster.
    - navigate_to_status: When user wants to check/track their application or complaint status.
    - navigate_to_welcome: When user wants to go to the start screen.
    - go_back: When user says back, return, previous, vapas.

    SERVICE NAVIGATION (TWO LEVELS):

    Level 1 — "navigate_to_service" with params { "serviceId": "..." }
    Takes the user to the service sub-dashboard showing sub-service options:
    - serviceId: "electricity" → Electricity/Power/Bijli. Matches: electricity bill, bijli bill, power connection, vidyut, बिजली, বিদ্যুৎ, విద్యుత్, वीज, மின்சாரம், વીજળી, ವಿದ್ಯುತ್, വൈദ്യുതി, ਬਿਜਲੀ
    - serviceId: "water" → Water supply/Paani. Matches: water bill, paani bill, jal, water connection, पानी, জল, నీరు, पाणी, தண்ணீர், પાણી, ನೀರು, വെള്ളം, ਪਾਣੀ
    - serviceId: "gas" → Gas/LPG/Cooking gas. Matches: gas bill, gas booking, LPG, cylinder, refill, गैस, গ্যাস, గ్యాస్, गॅस, கேஸ், ગેસ, ಗ್ಯಾಸ್, ഗ്യാസ്, ਗੈਸ
    - serviceId: "waste" → Waste/Garbage. Matches: waste, garbage, kachra, dustbin, safai, कचरा, বর্জ্য, వ్యర్థాలు, कचरा, கழிவு, કચરો, ತ್ಯಾಜ್ಯ, മാലിന്യം, ਕੂੜਾ
    - serviceId: "health" → Health/Medical. Matches: health, hospital, OPD, doctor, lab report, medical, स्वास्थ्य, সুশ্রুত, ఆరోగ్యం, आरोग्य, ஆரோக்கியம், આરોગ્ય, ಆರೋಗ್ಯ, ആരോഗ്യം, ਸਿਹਤ
    - serviceId: "certificates" → Certificates/Documents. Matches: certificate, birth certificate, death certificate, income certificate, pramaan patra, प्रमाण पत्र, সার্টিফিকেট, ధృవీకరణ, प्रमाणपत्र, சான்றிதழ், પ્રમાણપત્ર, ಪ್ರಮಾಣಪತ್ರ, സർട്ടിഫിക്കറ്റ്, ਸਰਟੀਫਿਕੇਟ

    Level 2 — "navigate_to_sub_service" with params { "serviceId": "...", "subServiceId": "..." }
    Takes the user directly to a specific sub-service application form:
    Electricity sub-services: new-connection, bill-payment, complaint
    Water sub-services: new-connection, bill-payment, supply-status
    Gas sub-services: refill-booking, new-connection, leakage-report
    Waste sub-services: collection, bulk-pickup, new-dustbin
    Health sub-services: opd-registration, lab-reports, doctor-availability
    Certificates sub-services: birth-certificate, death-certificate, income-certificate

    ═══════ CRITICAL ROUTING RULES ═══════

    1. When the user mentions a SERVICE category (e.g., "bijli"), use "navigate_to_service" to show them the sub-service options.
    2. When the user mentions a SPECIFIC sub-service (e.g., "bijli ka bill bharna hai"), use "navigate_to_sub_service" to go directly to the form.
       Example: User says "bijli ka bill bharna hai" → action: "navigate_to_sub_service", params: { "serviceId": "electricity", "subServiceId": "bill-payment" }
    3. Example: User says "kachra uthvana hai" → action: "navigate_to_sub_service", params: { "serviceId": "waste", "subServiceId": "collection" }
    4. Example: User says "mujhe bijli ke baare mein jaanna hai" → action: "navigate_to_service", params: { "serviceId": "electricity" }
    5. Example: User says "application status check karna hai" → action: "navigate_to_status"
    6. If the user is already on the correct screen, do NOT navigate — just guide them on what to do next.
    7. LOGIN CONTEXT: If currentScreen is "dashboard", "service_detail", "service_dashboard", "status", "success", or "creative", the user IS ALREADY LOGGED IN — navigate directly. Do NOT send them to login.
    8. If currentScreen is "welcome" or "login", the user is NOT logged in yet — use "navigate_to_login" and tell them to log in first.
    9. Always respond with a helpful text message explaining what you're doing AND the appropriate action.
    10. When on "service_dashboard", guide the user to pick a specific sub-service card from the grid.
    11. When on "service_detail", guide them to upload documents and submit.

    GUIDELINES:
    1. Login screen → guide Aadhaar entry. Dashboard → explain services.
    2. Service Dashboard → explain the sub-service options available.
    3. Service Detail → explain document upload and submission.
    4. MUST respond in ${languageName}.

    Respond ONLY in JSON: { "text": "...", "action": "action_name", "params": { "serviceId": "exact_id", "subServiceId": "exact_id" } }
    If no navigation is needed, omit the "action" and "params" fields.`;


    try {
        const contents = [
            ...chatHistory,
            { role: "user", parts: [{ text: userInput }] },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: { systemInstruction, responseMimeType: "application/json" },
        });

        const resultText = response.text || "{}";
        let result;
        try { result = JSON.parse(resultText); } catch { result = { text: resultText }; }

        chatHistory.push({ role: "user", parts: [{ text: userInput }] });
        chatHistory.push({ role: "model", parts: [{ text: resultText }] });
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

        return result;
    } catch (error) {
        console.error("[Server] Gemini assistant error:", error);
        try {
            const fallbackAi = getClient();
            const fallback = await fallbackAi.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: userInput,
                config: { systemInstruction, responseMimeType: "application/json" },
            });
            try { return JSON.parse(fallback.text || "{}"); } catch { return { text: fallback.text || "" }; }
        } catch { return { text: "" }; }
    }
}

/** Handle /api/proactive — narrative screen guide */
export async function handleProactiveHelp(body: ProactiveRequest) {
    const { currentContext, language, userHistory } = body;
    const languageName = LANGUAGE_MAP[language] || "Hindi";
    const ai = getClient();
    const screenGuide = SCREEN_GUIDE[currentContext] || `The user is on the ${currentContext} screen.`;

    const systemInstruction = `
    You are SUVIDHA, an AI kiosk NARRATIVE GUIDE.
    Speak like a helpful government employee standing next to the user.

    CURRENT SCREEN: ${screenGuide}
    Language: ${languageName} (respond entirely in ${languageName})
    History: ${userHistory.slice(-5).join(", ")}

    YOUR ROLE:
    1. Act as narrator — explain what this screen does and what the user can do.
    2. Be warm, clear, and encouraging. Imagine elderly or non-tech-savvy users.
    3. 2-3 sentences, concise but informative.
    4. Use friendly tone: "Welcome to..." or "On this screen, you can..."

    Respond ONLY in JSON: { "text": "..." }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: "Generate the proactive guide narration for this screen.",
            config: { systemInstruction, responseMimeType: "application/json" },
        });
        try { return JSON.parse(response.text || "{}"); } catch { return { text: response.text || "" }; }
    } catch { return { text: "" }; }
}

/** Handle /api/analyze-document — document analysis with image */
export async function handleDocumentAnalysis(body: DocumentAnalysisRequest) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [
                { inlineData: { data: body.base64Data, mimeType: body.mimeType } },
                { text: "Analyze this document. Is it a valid government ID or utility bill? Extract the name and address if possible." },
            ],
        },
    });
    return { text: response.text || "Analysis complete." };
}

/** Handle /api/generate-poster — AI poster generation */
export async function handlePosterGeneration(body: PosterRequest) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
            parts: [{ text: `A professional civic awareness poster for ${body.prompt}. Style: Modern, clean, governmental.` }],
        },
        config: {
            imageConfig: { aspectRatio: body.aspectRatio as any },
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return { imageData: part.inlineData.data };
        }
    }
    return { imageData: null };
}

/** Handle /api/tts — text-to-speech via Gemini */
export async function handleTTS(body: TTSRequest) {
    const ai = getClient();
    const langName = body.lang.startsWith("hi") ? "Hindi" : "English";

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in ${langName}: ${body.text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Kore" },
                },
            },
        },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return { audioData: audioData || null };
}
