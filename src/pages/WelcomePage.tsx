import React, { useState, useEffect } from "react";
import { useKiosk } from "../context/KioskContext";
import { t } from "../translations";

/**
 * Welcome page with brand identity and start action.
 */
export const WelcomePage = () => {
    const { language, handleAction } = useKiosk();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime.toLocaleTimeString(language === "hi" ? "hi-IN" : "en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const dateString = currentTime.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Spinning Mandala Star Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmin] h-[50vmin] opacity-10 pointer-events-none -z-10">
                <svg className="w-full h-full fill-saffron animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0 L110 90 L200 100 L110 110 L100 200 L90 110 L0 100 L90 90 Z"></path>
                    <circle cx="100" cy="100" fill="none" r="50" stroke="currentColor" strokeWidth="2"></circle>
                    <circle cx="100" cy="100" fill="none" r="30" stroke="currentColor" strokeWidth="1"></circle>
                </svg>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center text-center p-[2vmin] gap-[3vmin] overflow-hidden">
                {/* Brand and Time Section */}
                <div className="flex flex-col items-center space-y-[1.5vmin] flex-shrink-0">
                    <div className="space-y-0">
                        <h1 className="text-[12vmin] leading-[1.2] font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-saffron via-white to-india-green drop-shadow-2xl">
                            {t('welcome_title', language)}
                        </h1>
                        <p className="text-[2.2vmin] text-gray-600 font-bold tracking-widest uppercase mt-[-1vmin]">
                            {t('welcome_subtitle', language)}
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-[2vmin] bg-linear-to-r from-saffron via-white to-india-green opacity-20 blur-2xl rounded-full tracking-normal"></div>
                        <div className="relative flex flex-col items-center">
                            <span className="text-[5vmin] font-black font-mono text-gray-800 tracking-tight leading-none drop-shadow-sm uppercase">
                                {timeString}
                            </span>
                            <span className="text-[1.4vmin] font-bold text-gray-500 uppercase tracking-[0.4vmin] mt-[0.5vmin]">
                                {dateString}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-white/80 backdrop-blur-md p-[2.5vmin] rounded-[2.5vmin] shadow-lg border border-orange-100 max-w-[75vmin] w-[90%] flex flex-col justify-center flex-shrink min-h-0">
                    <h2 className="text-[3.5vmin] font-extrabold text-gray-800 mb-[0.5vmin] truncate">{t('welcome_title', language)}</h2>
                    <p className="text-[2vmin] text-gray-600 leading-tight font-medium line-clamp-2">
                        {t('welcome_subtitle', language)}
                    </p>
                    <div className="flex justify-center flex-wrap gap-[1.2vmin] mt-[1.2vmin] text-[1.8vmin]">
                        <span className="text-saffron font-black uppercase tracking-wider">{t('tag_secure', language)}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-india-green font-black uppercase tracking-wider">{t('tag_fast', language)}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-chakra-blue font-black uppercase tracking-wider">{t('tag_reliable', language)}</span>
                    </div>
                </div>

                {/* Start Button */}
                <div className="w-full flex justify-center px-[4vmin] flex-shrink-0">
                    <button
                        onClick={() => handleAction('navigate_to_login')}
                        className="group relative inline-flex items-center justify-center px-[6vmin] py-[2.5vmin] overflow-hidden font-black text-white transition-all duration-300 bg-saffron rounded-full hover:bg-orange-600 focus:outline-none focus:ring ring-offset-[0.5vmin] focus:ring-orange-400 shadow-xl hover:shadow-[0_1.5vmin_4vmin_-1vmin_rgba(255,153,51,0.5)] active:scale-95 w-full max-w-[60vmin] min-h-[10vmin] kiosk-button"
                    >
                        <span className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></span>
                        <span className="relative flex items-center gap-[1.5vmin] text-[4.5vmin] font-display leading-none">
                            <span className="material-symbols-outlined text-[6vmin] animate-bounce">touch_app</span>
                            {t('start_action', language)}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
