import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { useLocation } from 'react-router-dom';
import { useSpeechRecognition, useTextToSpeech } from '../hooks/useSpeech';
import { playSuccessSound } from '../services/audioService';
import type { Screen } from '../types';
import type { LanguageCode } from '../types';

/** Map pathname to Screen type for AI context */
function deriveScreenFromPath(pathname: string): Screen {
    if (pathname === '/') return 'welcome';
    if (pathname === '/login') return 'login';
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/status') return 'status';
    if (pathname === '/success') return 'success';
    if (pathname === '/creative') return 'creative';
    // Dynamic service routes: /:serviceId → dashboard, /:serviceId/:subServiceId → detail
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 2) return 'service_detail';
    if (segments.length === 1) return 'service_dashboard';
    return 'welcome';
}

/** BCP-47 locale map — hoisted outside component for zero re-allocation */
const LOCALE_MAP: Record<LanguageCode, string> = {
    en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN',
    mr: 'mr-IN', ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN',
    ml: 'ml-IN', pa: 'pa-IN',
};

const getSpeechLocale = (lang: LanguageCode): string =>
    LOCALE_MAP[lang] ?? 'hi-IN';

/**
 * Floating voice assistant FAB with speech recognition and Gemini AI guidance.
 * Shows proactive help messages on screen transitions and processes voice commands.
 */
export const VoiceAssistant = () => {
    const { language, handleAction } = useKiosk();
    const location = useLocation();
    const currentScreen = deriveScreenFromPath(location.pathname);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    const { speak, stop, isSpeaking } = useTextToSpeech();
    const [history, setHistory] = useState<string[]>([]);
    const [hasInteracted, setHasInteracted] = useState(false);
    const prevScreenRef = useRef<Screen>(currentScreen);
    const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Unlock audio context on first user interaction
    useEffect(() => {
        const unlock = () => {
            setHasInteracted(true);
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, []);

    // Proactive help — debounced and fires only on actual screen transitions
    useEffect(() => {
        if (!hasInteracted) return;
        if (currentScreen === prevScreenRef.current) return;
        prevScreenRef.current = currentScreen;

        // Debounce: wait 300ms so rapid transitions (e.g. login→dashboard) only fire once
        if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current);
        proactiveTimerRef.current = setTimeout(async () => {
            try {
                const { getProactiveHelp } = await import('../services/geminiService');
                const proactive = await getProactiveHelp(currentScreen, language, history);
                if (proactive.text) {
                    setLastResponse(proactive.text);
                    speak(proactive.text, getSpeechLocale(language));
                }
            } catch (err) {
                console.warn('Proactive help failed:', err);
            }
        }, 300);

        return () => {
            if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current);
        };
    }, [currentScreen, language, hasInteracted, history]);

    // Login success audio feedback
    useEffect(() => {
        if (prevScreenRef.current === 'login' && currentScreen === 'dashboard') {
            playSuccessSound();
        }
        // Note: prevScreenRef is updated in the proactive help effect
    }, [currentScreen]);

    const handleVoiceResult = useCallback(async (text: string) => {
        setIsProcessing(true);
        setHistory(prev => [...prev, `User: ${text}`]);
        try {
            const { getAssistantGuidance } = await import('../services/geminiService');
            const response = await getAssistantGuidance(text, currentScreen, language, history);
            setLastResponse(response.text);
            setHistory(prev => [...prev, `Assistant: ${response.text}`]);
            speak(response.text, getSpeechLocale(language));

            if (response.action) {
                handleAction(response.action, response.params);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    }, [currentScreen, language, history, handleAction, speak]);

    const speechLocale = getSpeechLocale(language);
    const { isListening, startListening } = useSpeechRecognition(handleVoiceResult, speechLocale);

    return (
        <div className="fixed bottom-24 right-8 flex flex-col items-end gap-4 z-50">
            <AnimatePresence>
                {lastResponse && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="max-w-xs bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 text-sm font-medium text-slate-700 relative"
                    >
                        <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100"></div>
                        {lastResponse}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => {
                    if (isSpeaking) {
                        stop();
                    } else {
                        startListening();
                    }
                }}
                disabled={isListening || isProcessing}
                className={`size-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all kiosk-button relative ${isListening ? 'bg-red-500 scale-110' :
                    isSpeaking ? 'bg-chakra-blue' :
                        isProcessing ? 'bg-saffron' :
                            'bg-india-green'
                    }`}
            >
                {isSpeaking ? (
                    <div className="flex items-center gap-1 h-8">
                        <motion.div animate={{ height: [10, 24, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 bg-white rounded-full" />
                        <motion.div animate={{ height: [15, 32, 15] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 bg-white rounded-full" />
                        <motion.div animate={{ height: [10, 24, 10] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 bg-white rounded-full" />
                    </div>
                ) : isProcessing ? (
                    <div className="flex gap-1">
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-white rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                    </div>
                ) : isListening ? (
                    <MicOff size={32} />
                ) : (
                    <Mic size={32} />
                )}

                {/* Ripple effect when listening or speaking */}
                {(isListening || isSpeaking) && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                            className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                            className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
                        />
                        <motion.div
                            animate={{ scale: [1, 2.1], opacity: [0.1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1 }}
                            className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
                        />
                    </>
                )}
            </button>
        </div>
    );
};
