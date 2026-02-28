import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Download, CheckCircle2 } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';
import { analyzeDocument } from '../services/geminiService';
import { ServiceIcon } from '../components/ServiceIcon';
import { SERVICES } from '../types';
import { useParams } from 'react-router-dom';

/**
 * Service detail page with application forms and info.
 * Data is derived from selectedService in context or serviceId in URL.
 */
export const ServiceDetailPage = () => {
    const { serviceId: urlServiceId, subServiceId } = useParams<{ serviceId: string; subServiceId: string }>();
    const { language, selectedService, setSelectedService, handleAction } = useKiosk();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Sync selected service from URL if missing (for deep links)
    useEffect(() => {
        if (!selectedService && urlServiceId) {
            const service = SERVICES.find(s => s.id === urlServiceId);
            if (service) setSelectedService(service);
        }
    }, [urlServiceId, selectedService, setSelectedService]);

    const service = selectedService || (urlServiceId ? SERVICES.find(s => s.id === urlServiceId) : null);
    const subService = service?.subServices.find(sub => sub.id === subServiceId);

    if (!service) {
        return (
            <div className="flex flex-col items-center justify-center gap-[2vmin]">
                <p className="text-[2.5vmin] font-bold text-slate-500">Service not found.</p>
                <button onClick={() => handleAction('go_back')} className="px-[3vmin] py-[1.5vmin] bg-saffron text-white rounded-[1.2vmin] font-bold kiosk-button">
                    {t('go_back', language)}
                </button>
            </div>
        );
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError(null);

        // 5MB file size guard
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            setUploadError(t('file_too_large', language));
            return;
        }

        setAnalyzing(true);
        setAnalysisResult(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64Data = (reader.result as string).split(',')[1] ?? '';
                const result = await analyzeDocument(base64Data, file.type);
                setAnalysisResult(result);
            } catch (err) {
                console.error('Document analysis failed:', err);
                setUploadError('Analysis failed. Please try again.');
            } finally {
                setAnalyzing(false);
            }
        };
        reader.onerror = () => {
            setAnalyzing(false);
            setUploadError('Failed to read file. Please try again.');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        handleAction('navigate_to_success');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: '2vmin' }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col gap-[1.5vmin] overflow-hidden"
        >
            <button onClick={() => handleAction('go_back')} className="flex items-center gap-[0.8vmin] text-slate-500 font-bold text-[1.5vmin] kiosk-button w-fit flex-shrink-0">
                <ArrowLeft size="1.8vmin" />
                {t('go_back', language)}
            </button>

            <div className="bg-white p-[3vmin] rounded-[2.5vmin] shadow-xl border border-slate-100 flex flex-col gap-[2vmin] flex-grow min-h-0 overflow-hidden">
                <div className="flex items-center gap-[2vmin] flex-shrink-0">
                    <div className={`size-[8vmin] rounded-[2vmin] ${service?.color ?? 'bg-slate-200'} text-white flex items-center justify-center shadow-xl`}>
                        <ServiceIcon serviceId={service?.id ?? ''} size="5vmin" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[3.5vmin] font-bold text-slate-900 leading-tight truncate">
                            {subService?.translations[language].title ?? service?.translations[language].title}
                        </h2>
                        <p className="text-[1.6vmin] text-slate-500 leading-none">
                            {subService?.translations[language].description ?? t('new_connection_msg', language)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-[1.5vmin] flex-grow min-h-0 overflow-hidden">
                    {/* Document upload */}
                    <label className="block cursor-pointer flex-shrink-0">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        <div className="p-[2.5vmin] bg-blue-50 rounded-[2vmin] border-[0.25vmin] border-dashed border-blue-200 flex flex-col items-center justify-center gap-[1vmin] text-center hover:bg-blue-100 transition-colors">
                            <div className="p-[1.2vmin] bg-white rounded-full text-chakra-blue shadow-sm">
                                {analyzing ? <div className="animate-spin"><Clock size="2.5vmin" /></div> : <Download size="2.5vmin" />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800 text-[1.6vmin]">
                                    {analyzing ? t('analyzing', language) : t('upload_docs', language)}
                                </p>
                                <p className="text-[1.1vmin] text-slate-500 mt-[0.3vmin]">ID Proof, Address Proof (Max 5MB)</p>
                            </div>
                        </div>
                    </label>

                    {uploadError && (
                        <p className="text-center text-red-500 font-bold text-[1.3vmin] flex-shrink-0">{uploadError}</p>
                    )}

                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-[1.2vmin] bg-green-50 border border-green-100 rounded-[1.2vmin] text-[1.2vmin] text-green-800 font-medium flex-shrink min-h-0 overflow-hidden"
                        >
                            <div className="flex items-center gap-[0.8vmin] mb-[0.3vmin] flex-shrink-0">
                                <CheckCircle2 size="1.4vmin" />
                                <span className="font-bold">AI Verification Result:</span>
                            </div>
                            <p className="line-clamp-3">{analysisResult}</p>
                        </motion.div>
                    )}

                    {/* Submit button pushed to bottom */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full py-[2vmin] bg-india-green text-white rounded-[1.5vmin] text-[2.5vmin] font-bold shadow-xl shadow-green-100 kiosk-button flex items-center justify-center gap-[0.8vmin] disabled:opacity-70 mt-auto flex-shrink-0"
                    >
                        {submitting ? (
                            <>
                                <div className="size-[2.5vmin] border-[0.3vmin] border-white/30 border-t-white rounded-full animate-spin"></div>
                                {t('submitting', language)}
                            </>
                        ) : (
                            t('submit_request', language)
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
