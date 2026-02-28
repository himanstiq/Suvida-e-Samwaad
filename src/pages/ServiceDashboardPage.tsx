import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';
import { ServiceIcon } from '../components/ServiceIcon';
import { SERVICES } from '../types';

/**
 * Generalized sub-service dashboard — renders a card grid of sub-services
 * for any parent service. Reads :serviceId from the URL.
 */
export const ServiceDashboardPage = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const { language, handleAction } = useKiosk();

    const service = SERVICES.find(s => s.id === serviceId);

    if (!service) {
        return (
            <div className="flex flex-col items-center justify-center gap-[2vmin] h-full">
                <p className="text-[2.5vmin] font-bold text-slate-500">Service not found.</p>
                <button onClick={() => handleAction('go_back')} className="px-[3vmin] py-[1.5vmin] bg-saffron text-white rounded-[1.2vmin] font-bold kiosk-button">
                    {t('go_back', language)}
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-[2vmin] overflow-hidden">
            <button onClick={() => handleAction('go_back')} className="flex items-center gap-[0.8vmin] text-slate-500 font-bold text-[1.5vmin] kiosk-button w-fit flex-shrink-0">
                <ArrowLeft size="1.8vmin" />
                {t('go_back', language)}
            </button>

            {/* Service header */}
            <div className="flex items-center gap-[2vmin] flex-shrink-0">
                <div className={`size-[8vmin] rounded-[2vmin] ${service.color} text-white flex items-center justify-center shadow-xl`}>
                    <ServiceIcon serviceId={service.id} size="5vmin" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-[3.5vmin] font-black text-slate-900 leading-tight truncate">
                        {service.translations[language].title}
                    </h1>
                    <p className="text-[1.6vmin] text-slate-500 leading-tight">
                        {service.translations[language].description}
                    </p>
                </div>
            </div>

            {/* Sub-service cards grid — no scroll, fits viewport */}
            <div className="grid grid-cols-3 gap-[2vmin] flex-grow min-h-0 overflow-hidden">
                {service.subServices.map((sub, index) => (
                    <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-[2vmin] rounded-[2vmin] shadow-lg border-2 border-transparent hover:border-chakra-blue transition-all cursor-pointer flex flex-col items-center text-center gap-[1.2vmin] kiosk-button"
                        onClick={() => navigate(`/${service.id}/${sub.id}`)}
                    >
                        <div className={`size-[6vmin] rounded-full ${sub.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                            <span className="material-symbols-outlined text-[3.5vmin]" style={{ color: 'inherit' }}>
                                {sub.icon}
                            </span>
                        </div>
                        <h3 className="text-[1.8vmin] font-bold text-slate-900 leading-tight">
                            {sub.translations[language].title}
                        </h3>
                        <p className="text-slate-500 text-[1.2vmin] leading-tight line-clamp-2">
                            {sub.translations[language].description}
                        </p>
                        <button className={`mt-auto py-[0.8vmin] ${sub.color} text-white font-bold rounded-[1vmin] w-full text-[1.3vmin] pointer-events-none flex items-center justify-center gap-[0.5vmin]`}>
                            {t(sub.actionLabelKey, language)}
                            <ChevronRight size="1.3vmin" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
