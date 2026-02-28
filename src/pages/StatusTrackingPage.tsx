import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Clock, QrCode } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';

/**
 * Application status tracking page with a vertical timeline.
 */
export const StatusTrackingPage = () => {
    const { language, handleAction } = useKiosk();

    const steps = [
        { title: 'Submitted', titleHi: 'जमा किया गया', date: 'Oct 24, 2023', dateHi: '24 अक्टूबर, 2023', status: 'completed', icon: <CheckCircle2 /> },
        { title: 'Verification', titleHi: 'सत्यापन', date: 'Oct 25, 2023', dateHi: '25 अक्टूबर, 2023', status: 'completed', icon: <CheckCircle2 /> },
        { title: 'Field Inspection', titleHi: 'क्षेत्र निरीक्षण', date: 'In Progress', dateHi: 'प्रगति पर है', status: 'active', icon: <Clock /> },
        { title: 'Final Approval', titleHi: 'अंतिम स्वीकृति', date: 'Pending', dateHi: 'लंबित', status: 'pending', icon: <QrCode /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col gap-[2vmin] overflow-hidden"
        >
            <button onClick={() => handleAction('go_back')} className="flex items-center gap-[0.8vmin] text-slate-500 font-bold text-[1.5vmin] kiosk-button w-fit flex-shrink-0">
                <ArrowLeft size="1.8vmin" />
                {t('go_back', language)}
            </button>

            <div className="text-center space-y-[0.3vmin] flex-shrink-0">
                <h2 className="text-[3.5vmin] font-bold text-slate-900 leading-tight">
                    {t('track_application', language)}
                </h2>
                <p className="text-[1.6vmin] text-slate-500 font-mono">ARN-2023-8899-0012</p>
            </div>

            <div className="bg-white p-[3vmin] rounded-[2.5vmin] shadow-xl border border-slate-100 flex-grow min-h-0 overflow-hidden flex flex-col justify-center">
                <div className="relative space-y-[3vmin] w-full max-w-[70vmin] mx-auto">
                    {/* Vertical progress track */}
                    <div className="absolute left-[3vmin] top-[0.5vmin] bottom-[0.5vmin] w-[0.3vmin] bg-slate-100 rounded-full">
                        <div className="h-2/3 w-full bg-india-green rounded-full"></div>
                    </div>

                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-[3vmin] items-start relative z-10 min-h-0">
                            <div className={`size-[6vmin] rounded-full flex items-center justify-center shadow-lg ring-[0.6vmin] ring-white flex-shrink-0 ${step.status === 'completed' ? 'bg-india-green text-white' :
                                step.status === 'active' ? 'bg-saffron text-white animate-pulse' :
                                    'bg-slate-100 text-slate-400'
                                }`}>
                                {React.cloneElement(step.icon as React.ReactElement, { size: '3vmin' })}
                            </div>
                            <div className="flex-1 pt-[0.3vmin] min-h-0">
                                <div className="flex justify-between items-center gap-[2vmin]">
                                    <h3 className={`text-[2.2vmin] font-bold leading-tight ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                                        {language === 'hi' ? step.titleHi : step.title}
                                    </h3>
                                    <span className={`text-[1.2vmin] font-bold whitespace-nowrap ${step.status === 'completed' ? 'text-india-green' : 'text-slate-400'}`}>
                                        {language === 'hi' ? step.dateHi : step.date}
                                    </span>
                                </div>
                                {step.status === 'active' && (
                                    <p className="text-slate-500 mt-[0.3vmin] text-[1.4vmin] leading-tight">
                                        {language === 'hi' ? 'निरीक्षण के लिए साइट इंजीनियर नियुक्त किया गया है।' : 'Site engineer has been assigned for inspection.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
