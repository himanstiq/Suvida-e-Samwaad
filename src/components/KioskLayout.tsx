import React, { type ReactNode } from "react";
import { useKiosk } from "../context/KioskContext";
import type { LanguageCode } from "../types";
import { LANGUAGES } from "../types";

import EmblemIndia from "../Emblem_of_India.svg";
import CDACLogo from "../cdac_logo.png";

export const KioskLayout = ({ children }: { children: ReactNode }) => {
    const { language, setLanguage, user, logout } = useKiosk();

    return (
        <div className="relative w-screen h-dvh flex flex-col font-body overflow-hidden bg-surface">
            {/* Header — fixed vmin height so it scales uniformly on any screen */}
            <header className="h-[8vmin] w-full bg-surface shadow-md border-b-2 border-saffron relative z-20 flex-shrink-0">
                <div className="h-0.5 w-full bg-linear-to-r from-saffron via-white to-india-green"></div>
                <div className="px-[3vmin] h-[calc(100%-2px)] flex items-center justify-between w-full mx-auto">
                    <div className="flex items-center gap-[2vmin] h-full">
                        <div className="h-[60%] w-auto flex items-center justify-center">
                            <img src={EmblemIndia} alt="Emblem of India" className="h-full w-auto object-contain" />
                        </div>
                        <div className="flex flex-col justify-center leading-tight">
                            <span className="text-[1.1vmin] font-bold text-gray-500 uppercase tracking-tighter">Government of India</span>
                            <span className="text-[1.8vmin] font-black text-on-surface leading-none font-display">भारत सरकार</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-[2vmin] h-full">
                        <div className="h-[50%] w-auto flex items-center justify-center">
                            <img src={CDACLogo} alt="CDAC" className="h-full w-auto object-contain" />
                        </div>

                        {/* Login status badge — visible only when authenticated */}
                        {user && (
                            <>
                                <div className="h-[50%] w-px bg-gray-200 mx-[0.5vmin]"></div>
                                <div className="flex items-center gap-[1vmin] bg-green-50 border border-green-200 rounded-[1.2vmin] px-[1.5vmin] py-[0.6vmin]">
                                    <span className="material-symbols-outlined filled text-green-600 text-[2vmin]">verified_user</span>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-[1.3vmin] font-bold text-green-800">{user.name}</span>
                                        <span className="text-[1vmin] text-green-600 font-mono tracking-wide">
                                            XXXX XXXX {user.aadhaar.slice(-4)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="ml-[0.3vmin] p-[0.4vmin] rounded-lg hover:bg-red-100 transition-colors group"
                                        title="Logout"
                                    >
                                        <span className="material-symbols-outlined text-[1.6vmin] text-gray-400 group-hover:text-red-500 transition-colors">logout</span>
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="h-[50%] w-px bg-gray-200 mx-[0.5vmin]"></div>
                        {/* Language Selector */}
                        <div className="relative group min-w-[14vmin]">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-[1vmin] pointer-events-none text-saffron">
                                <span className="material-symbols-outlined text-[2vmin]">translate</span>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                                className="appearance-none w-full bg-surface-variant border border-gray-300 text-on-surface text-[1.4vmin] rounded-[1.2vmin] focus:ring-saffron focus:border-saffron block pl-[3.5vmin] p-[0.8vmin] font-bold cursor-pointer hover:bg-orange-50 transition-colors shadow-sm"
                            >
                                {LANGUAGES.map(l => (
                                    <option key={l.code} value={l.code}>{l.nativeName}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-[0.8vmin] pointer-events-none text-gray-500">
                                <span className="material-symbols-outlined text-[2vmin]">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content — flex-grow takes all remaining space between header and footer */}
            <main className="flex-grow w-full relative z-10 flex flex-col items-center justify-center p-[2vmin] min-h-0 overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center max-w-[95vw] mx-auto">
                    {children}
                </div>
            </main>

            {/* Footer — compact vmin height */}
            <footer className="h-[5vmin] w-full bg-white relative z-20 flex-shrink-0 flex flex-col">
                <div className="flex-grow flex items-center">
                    <div className="px-[3vmin] flex justify-between items-center w-full mx-auto">
                        <div className="flex items-center gap-[1vmin] text-gray-500 font-bold">
                            <span className="material-symbols-outlined filled text-india-green text-[2.5vmin]">verified</span>
                            <span className="text-[1.4vmin]">आत्मनिर्भर भारत का हिस्सा (Part of Atmanirbhar Bharat)</span>
                        </div>
                        <div className="flex gap-[2vmin]">
                            <button className="flex items-center gap-[0.5vmin] px-[2vmin] py-[0.8vmin] rounded-full bg-blue-50 text-chakra-blue text-[1.4vmin] font-bold hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                                <span className="material-symbols-outlined text-[1.8vmin]">help</span>
                                सहायता (Help)
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
