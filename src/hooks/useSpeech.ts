import { useState, useCallback } from "react";
import { textToSpeech } from "../services/geminiService";

/**
 * Hook for browser speech recognition (STT).
 * Uses the Web Speech API with the specified language.
 */
export function useSpeechRecognition(onResult: (text: string) => void, lang: string = 'hi-IN') {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => setError(event.error);
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            onResult(text);
        };

        recognition.start();
    }, [onResult, lang]);

    return { isListening, startListening, error };
}

/**
 * Hook for text-to-speech (TTS).
 * Tries Gemini TTS (via server proxy) first, falls back to browser SpeechSynthesis.
 * No API keys in this file — all AI calls go through the server.
 */
export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const speak = async (text: string, lang: string = 'hi-IN') => {
        if (!text) return;

        stop();
        setIsSpeaking(true);

        const fallback = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9; // Slightly slower for kiosk clarity
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        };

        try {
            // Call server proxy for Gemini TTS
            const audioData = await textToSpeech(text, lang);

            if (audioData) {
                const audioSrc = `data:audio/wav;base64,${audioData}`;
                const audio = new Audio(audioSrc);
                audio.onended = () => setIsSpeaking(false);
                audio.onerror = () => {
                    console.warn("Audio element error, falling back to browser TTS");
                    fallback();
                };
                try {
                    await audio.play();
                } catch {
                    console.warn("Audio playback blocked or failed, falling back to browser TTS");
                    fallback();
                }
            } else {
                fallback();
            }
        } catch (error: any) {
            if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
                console.warn("Gemini TTS Quota Exceeded. Using browser fallback.");
            } else {
                console.error("Gemini TTS Error:", error);
            }
            fallback();
        }
    };

    return { speak, stop, isSpeaking };
}
