import React, { useEffect, type ComponentType } from "react";
import { KioskProvider, useKiosk } from "./context/KioskContext";
import { KioskLayout } from "./components/KioskLayout";
import { KioskErrorBoundary } from "./components/KioskErrorBoundary";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { WelcomePage } from "./pages/WelcomePage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { StatusTrackingPage } from "./pages/StatusTrackingPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ServiceDashboardPage } from "./pages/ServiceDashboardPage";
import { CreativePage } from "./pages/CreativePage";
import { AnimatePresence, motion } from "motion/react";
import { playClickSound, playSuccessSound } from "./services/audioService";
import type { Screen } from "./types";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

/**
 * Main kiosk content — renders the active screen inside AnimatePresence
 * for smooth page transitions.
 */
const KioskContent = () => {
  const location = useLocation();

  // Global click sound for elements with .kiosk-button class
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.kiosk-button')) {
        playClickSound();
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Success sound when reaching the success screen
  useEffect(() => {
    if (location.pathname === '/success') {
      playSuccessSound();
    }
  }, [location.pathname]);

  return (
    <KioskLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          <Routes location={location}>
            {/* Static routes (matched first by React Router ranking) */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/status" element={<StatusTrackingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/creative" element={<CreativePage />} />
            {/* Dynamic service routes: /:serviceId shows sub-service cards, /:serviceId/:subServiceId shows detail form */}
            <Route path="/:serviceId" element={<ServiceDashboardPage />} />
            <Route path="/:serviceId/:subServiceId" element={<ServiceDetailPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <VoiceAssistant />
    </KioskLayout>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <KioskProvider>
        <KioskErrorBoundary>
          <KioskContent />
        </KioskErrorBoundary>
      </KioskProvider>
    </BrowserRouter>
  );
}

export default App;
