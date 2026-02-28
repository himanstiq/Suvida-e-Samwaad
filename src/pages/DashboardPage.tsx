import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ChevronRight } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';
import { SERVICES } from '../types';
import { ServiceIcon } from '../components/ServiceIcon';

/**
 * Main dashboard showing available civic services.
 * Includes links to track applications and AI poster creation.
 */
export const DashboardPage = () => {
    const { language, setSelectedService, handleAction } = useKiosk();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col gap-[2vmin] overflow-hidden"
        >
            <div className="flex justify-between items-end flex-shrink-0">
                <div className="space-y-[0.3vmin]">
                    <h2 className="text-[4vmin] font-bold text-slate-900 leading-tight">
                        {t('select_service', language)}
                    </h2>
                </div>
                <div className="flex items-center gap-[1.5vmin] flex-shrink-0">
                    <button
                        onClick={() => handleAction('navigate_to_status')}
                        className="flex items-center gap-[0.8vmin] bg-white/90 hover:bg-white px-[1.5vmin] py-[1vmin] rounded-[1.2vmin] text-[1.4vmin] font-bold text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95 kiosk-button"
                    >
                        <Search size="1.6vmin" className="text-chakra-blue" />
                        {t('track_application', language)}
                    </button>
                    <button
                        onClick={() => handleAction('navigate_to_creative')}
                        className="flex items-center gap-[0.8vmin] bg-chakra-blue text-white px-[1.5vmin] py-[1vmin] rounded-[1.2vmin] text-[1.4vmin] font-bold shadow-md hover:bg-blue-600 transition-all active:scale-95 kiosk-button"
                    >
                        <Sparkles size="1.6vmin" />
                        {t('create_poster', language)}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-[2vmin] flex-grow min-h-0 overflow-hidden">
                {SERVICES.map(service => (
                    <button
                        key={service.id}
                        onClick={() => {
                            setSelectedService(service);
                            handleAction('navigate_to_service', { serviceId: service.id });
                        }}
                        className="group bg-white p-[2.5vmin] rounded-[2.5vmin] shadow-lg hover:shadow-2xl transition-all border border-slate-100 text-left flex flex-col gap-[1.5vmin] kiosk-button relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-[10vmin] h-[10vmin] ${service.color} opacity-5 rounded-bl-[6vmin]`}></div>
                        <div className={`size-[6vmin] rounded-[1.5vmin] ${service.color} text-white flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <ServiceIcon serviceId={service.id} size="3.5vmin" />
                        </div>
                        <div className="flex-grow min-h-0">
                            <h3 className="text-[2.2vmin] font-bold text-slate-900 mb-[0.3vmin] truncate">
                                {service.translations[language].title}
                            </h3>
                            <p className="text-[1.4vmin] text-slate-500 leading-tight line-clamp-2">
                                {service.translations[language].description}
                            </p>
                        </div>
                        <div className="flex items-center gap-[0.8vmin] text-slate-400 font-bold text-[1.3vmin] group-hover:text-chakra-blue transition-colors mt-auto">
                            {t('proceed', language)}
                            <ChevronRight size="1.5vmin" />
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};
