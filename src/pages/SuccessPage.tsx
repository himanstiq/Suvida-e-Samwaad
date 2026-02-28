import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, QrCode, Printer, Download } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';

/**
 * Success/confirmation page shown after a service request.
 * Features a QR receipt code and auto-redirect countdown.
 */
export const SuccessPage = () => {
    const { language, handleAction } = useKiosk();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            handleAction('navigate_to_dashboard');
        }
    }, [countdown, handleAction]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center gap-[3vmin] overflow-hidden"
        >
            <div className="relative inline-block flex-shrink-0">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="size-[10vmin] bg-india-green rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
                    <CheckCircle2 size="6vmin" />
                </div>
            </div>

            <div className="text-center space-y-[0.5vmin] flex-shrink-0">
                <h2 className="text-[5vmin] font-black text-slate-900 leading-tight">
                    {t('thank_you', language)}
                </h2>
                <p className="text-[2vmin] text-slate-500 font-medium">
                    {t('success_msg', language)}
                </p>
            </div>

            <div className="bg-white p-[2.5vmin] rounded-[2.5vmin] shadow-xl border border-slate-100 flex flex-col items-center gap-[1.5vmin] w-full max-w-[50vmin] flex-shrink min-h-0 overflow-hidden">
                <div className="p-[1.5vmin] bg-slate-50 rounded-[2vmin] border border-slate-100 flex-shrink min-h-0">
                    <QrCode size="15vmin" className="text-slate-800" />
                </div>
                <div className="space-y-[0.3vmin] flex-shrink-0">
                    <p className="text-[1.6vmin] font-bold text-slate-800">
                        {t('download_receipt', language)}
                    </p>
                    <p className="text-[1.2vmin] text-slate-400">
                        {t('scan_receipt', language)}
                    </p>
                </div>

                <div className="flex gap-[1.5vmin] w-full flex-shrink-0">
                    <button className="flex-1 py-[1.2vmin] bg-slate-100 text-slate-700 rounded-[1.2vmin] font-bold flex items-center justify-center gap-[0.5vmin] text-[1.4vmin] kiosk-button">
                        <Printer size="1.8vmin" />
                        {t('print_receipt', language)}
                    </button>
                    <button className="flex-1 py-[1.2vmin] bg-slate-100 text-slate-700 rounded-[1.2vmin] font-bold flex items-center justify-center gap-[0.5vmin] text-[1.4vmin] kiosk-button">
                        <Download size="1.8vmin" />
                        {t('download_button', language)}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-[0.8vmin] text-slate-400 font-bold text-[1.4vmin] flex-shrink-0">
                <div className="size-[3vmin] rounded-full border-[0.3vmin] border-slate-200 border-t-saffron animate-spin"></div>
                {t('returning_home', language)} {countdown}s...
            </div>
        </motion.div>
    );
};
