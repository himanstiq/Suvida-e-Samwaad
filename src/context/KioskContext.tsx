import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Screen, LanguageCode, User, Service } from "../types";
import { SERVICES } from "../types";
import { resetChatSession } from "../services/geminiService";

import { useNavigate, useLocation } from "react-router-dom";

interface KioskContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    selectedService: Service | null;
    setSelectedService: (service: Service | null) => void;
    /** Central navigation handler — dispatches screen transitions based on action strings */
    handleAction: (action: string, params?: Record<string, string>) => void;
    logout: () => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [language, setLanguage] = useState<LanguageCode>("hi");
    const [user, setUser] = useState<User | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const logout = useCallback(() => {
        setUser(null);
        navigate('/');
        resetChatSession();
    }, [navigate]);

    const handleAction = useCallback((action: string, params?: Record<string, string>) => {
        switch (action) {
            case 'navigate_to_login': navigate('/login'); break;
            case 'navigate_to_dashboard': navigate('/dashboard'); break;
            case 'navigate_to_creative': navigate('/creative'); break;
            case 'navigate_to_service':
                if (params?.serviceId) {
                    const s = SERVICES.find(sv => sv.id === params.serviceId);
                    if (s) {
                        setSelectedService(s);
                        navigate(`/${params.serviceId}`);
                    }
                }
                break;
            case 'navigate_to_sub_service':
                if (params?.serviceId && params?.subServiceId) {
                    const s = SERVICES.find(sv => sv.id === params.serviceId);
                    if (s) {
                        setSelectedService(s);
                        navigate(`/${params.serviceId}/${params.subServiceId}`);
                    }
                }
                break;
            case 'navigate_to_status': navigate('/status'); break;
            case 'navigate_to_success': navigate('/success'); break;
            case 'navigate_to_welcome': navigate('/'); break;
            case 'go_back': {
                const path = location.pathname;
                // Sub-service detail (e.g. /waste/collection) → service dashboard (/waste)
                const segments = path.split('/').filter(Boolean);
                if (segments.length >= 2) {
                    navigate(`/${segments[0]}`);
                    // Service dashboard (e.g. /waste) or other pages → main dashboard
                } else if (path === '/status' || path === '/creative' || segments.length === 1) {
                    navigate('/dashboard');
                } else if (path === '/login') {
                    navigate('/');
                } else {
                    navigate(-1);
                }
                break;
            }
        }
    }, [navigate, location.pathname]);

    // Memoize to prevent every consumer from re-rendering on unrelated state changes
    const contextValue = useMemo(
        () => ({
            language,
            setLanguage,
            user,
            setUser,
            selectedService,
            setSelectedService,
            handleAction,
            logout,
        }),
        [language, user, selectedService, handleAction, logout]
    );

    return (
        <KioskContext.Provider value={contextValue}>
            {children}
        </KioskContext.Provider>
    );
};

export const useKiosk = () => {
    const context = useContext(KioskContext);
    if (!context) {
        throw new Error("useKiosk must be used within a KioskProvider");
    }
    return context;
};
