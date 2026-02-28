import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';
import { generatePoster } from '../services/geminiService';

/**
 * AI poster generator page for civic awareness campaigns.
 * All AI calls go through the server proxy — no API keys in the browser.
 */
export const CreativePage = () => {
    const { language, handleAction } = useKiosk();
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generating, setGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const imageData = await generatePoster(prompt, aspectRatio);
            if (imageData) {
                setImageUrl(`data:image/png;base64,${imageData}`);
            } else {
                setError(t('generation_error', language));
            }
        } catch (err) {
            console.error(err);
            setError(t('generation_error', language));
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-[2vmin] overflow-hidden">
            <button onClick={() => handleAction('go_back')} className="flex items-center gap-[0.8vmin] text-slate-500 font-bold text-[1.5vmin] kiosk-button w-fit flex-shrink-0">
                <ArrowLeft size="1.8vmin" />
                {t('go_back', language)}
            </button>

            <div className="bg-white p-[3vmin] rounded-[2.5vmin] shadow-xl border border-slate-100 flex flex-row gap-[3vmin] max-w-[80vmin] mx-auto w-full flex-grow min-h-0 overflow-hidden">
                {/* Left: Controls */}
                <div className="flex flex-col gap-[2vmin] flex-1 min-w-0">
                    <div className="flex items-center gap-[1vmin] text-chakra-blue flex-shrink-0">
                        <Sparkles size="3vmin" />
                        <h3 className="text-[2.8vmin] font-bold">{t('create_poster', language)}</h3>
                    </div>

                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('enter_topic', language)}
                        className="w-full p-[1.5vmin] bg-slate-50 rounded-[1.2vmin] border border-slate-200 font-medium text-[1.6vmin]"
                    />

                    <div className="flex flex-wrap gap-[0.8vmin]">
                        {['1:1', '3:4', '4:3', '9:16', '16:9'].map(ratio => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-[1.2vmin] py-[0.6vmin] rounded-[0.8vmin] font-bold text-[1.2vmin] transition-all ${aspectRatio === ratio ? 'bg-chakra-blue text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>

                    <p className="text-[1vmin] text-slate-400 italic">
                        {t('ai_disclaimer', language)}
                    </p>

                    <button
                        onClick={handleGenerate}
                        disabled={generating || !prompt}
                        className="w-full py-[1.5vmin] bg-saffron text-white rounded-[1.2vmin] font-bold shadow-lg disabled:opacity-50 kiosk-button text-[2vmin] mt-auto"
                    >
                        {generating ? t('generating', language) : t('create_poster', language)}
                    </button>

                    {error && (
                        <p className="text-center text-red-500 font-bold text-[1.3vmin]">{error}</p>
                    )}
                </div>

                {/* Right: Preview area */}
                <div className="flex-1 min-w-0 flex items-center justify-center bg-slate-50 rounded-[2vmin] border border-slate-100 overflow-hidden">
                    {imageUrl ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={imageUrl}
                            alt="Generated Poster"
                            className="max-w-full max-h-full object-contain rounded-[1vmin]"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-[1vmin] text-slate-300">
                            <Sparkles size="6vmin" />
                            <p className="text-[1.4vmin] font-bold">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
