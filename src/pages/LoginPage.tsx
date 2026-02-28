import React, { useState, useEffect, useCallback } from 'react';
import { useKiosk } from '../context/KioskContext';
import { t } from '../translations';

// Assets
import aadhaarSymbol from '../assets/aadhaar_symbol.png';

/**
 * Optimized Login Page for SUVIDHA Kiosk.
 * Uses vmin units throughout for uniform scaling on any screen aspect ratio.
 */
export const LoginPage = () => {
    const { language, setUser, handleAction } = useKiosk();
    const [aadhaar, setAadhaar] = useState('');
    const [authMethod, setAuthMethod] = useState<'aadhaar' | 'phone' | 'fingerprint'>('aadhaar');
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleNumClick = useCallback((num: string) => {
        setAadhaar(prev => {
            const maxLen = authMethod === 'aadhaar' ? 12 : 10;
            if (prev.length < maxLen && /^[0-9]$/.test(num)) {
                setError(null);
                return prev + num;
            }
            return prev;
        });
    }, [authMethod]);

    const handleDelete = useCallback(() => {
        setAadhaar(prev => prev.slice(0, -1));
        setError(null);
    }, []);

    const handleClear = useCallback(() => {
        setAadhaar('');
        setError(null);
    }, []);

    // Physical keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') handleNumClick(e.key);
            else if (e.key === 'Backspace') handleDelete();
            else if (e.key === 'Escape') handleClear();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNumClick, handleDelete, handleClear]);

    const handleVerifyValue = () => {
        const requiredLen = authMethod === 'aadhaar' ? 12 : 10;
        if (aadhaar.length === requiredLen) {
            setUser({ name: 'Citizen User', aadhaar });
            handleAction('navigate_to_dashboard');
        } else {
            setError(t('enter_aadhaar', language));
        }
    };

    const startFingerprintScan = () => {
        setIsScanning(true);
        // Simulate scanning process
        setTimeout(() => {
            setIsScanning(false);
            setUser({ name: 'Verified Citizen', aadhaar: 'Success' });
            handleAction('navigate_to_dashboard');
        }, 2000);
    };

    const formatAadhaar = (val: string) => {
        if (authMethod === 'phone') {
            return val.replace(/(\d{5})/g, '$1 ').trim();
        }
        return val.replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <div className="w-full flex flex-col items-center justify-center relative">
            {/* Background Blobs - Subtle */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] -z-5">
                <div className="absolute top-0 -right-1/4 w-[50vmin] h-[50vmin] rounded-full bg-saffron blur-[80px]"></div>
                <div className="absolute bottom-0 -left-1/4 w-[50vmin] h-[50vmin] rounded-full bg-india-green blur-[80px]"></div>
            </div>

            {/* Main row: Card + Fingerprint Scanner side-by-side */}
            <div className="flex items-stretch gap-[2vmin] w-full max-w-[75vmin]">
                {/* Left: Login Card */}
                <div className="flex-1 bg-white rounded-[2.5vmin] shadow-2xl border-t-[0.5vmin] border-ashoka-blue overflow-hidden">
                    {/* Compact Title Area */}
                    <div className="pt-[1.5vmin] pb-[0.8vmin] flex flex-col items-center text-center px-[3vmin]">
                        <div className="mb-[0.3vmin] bg-red-50 p-[1.2vmin] rounded-full text-aadhaar-red flex items-center justify-center">
                            <span className="material-symbols-outlined text-[3.5vmin] font-variation-fill-1">fingerprint</span>
                        </div>
                        <h1 className="text-gray-900 text-[2.8vmin] leading-tight font-bold tracking-tight">Login Securely</h1>
                        <p className="text-secondary text-[1.2vmin] mt-[0.2vmin] max-w-[35vmin] mx-auto opacity-70">
                            Select your preferred authentication method.
                        </p>
                    </div>

                    <div className="px-[2.5vmin] pb-[1.5vmin] pt-[0.5vmin]">
                        {/* Auth Method Switch */}
                        <div className="bg-slate-100 rounded-[1vmin] p-[0.5vmin] mb-[1.2vmin] flex border border-slate-200">
                            <button
                                onClick={() => { setAuthMethod('aadhaar'); setAadhaar(''); }}
                                className={`flex-1 flex items-center justify-center gap-[0.6vmin] py-[0.8vmin] rounded-[0.7vmin] text-[1.4vmin] font-bold transition-all ${authMethod === 'aadhaar' ? 'bg-white shadow-sm text-ashoka-blue border border-slate-200' : 'text-slate-500'}`}
                            >
                                <span className="material-symbols-outlined text-[1.8vmin]">fingerprint</span>
                                Aadhaar
                            </button>
                            <button
                                onClick={() => { setAuthMethod('phone'); setAadhaar(''); }}
                                className={`flex-1 flex items-center justify-center gap-[0.6vmin] py-[0.8vmin] rounded-[0.7vmin] text-[1.4vmin] font-bold transition-all ${authMethod === 'phone' ? 'bg-white shadow-sm text-ashoka-blue border border-slate-200' : 'text-slate-500'}`}
                            >
                                <span className="material-symbols-outlined text-[1.8vmin]">phone_iphone</span>
                                Phone Number
                            </button>
                        </div>

                        {/* Input Display */}
                        <div className="mb-[1.2vmin]">
                            <div className="flex flex-col gap-[0.5vmin]">
                                <div className="flex justify-between items-baseline px-[0.5vmin]">
                                    <label className="text-slate-600 text-[1.2vmin] font-bold uppercase tracking-wider">
                                        {authMethod === 'fingerprint' ? 'Biometric Validation' : (authMethod === 'aadhaar' ? 'Aadhaar Number' : 'Phone Number')}
                                    </label>
                                    <span className="text-[1.1vmin] text-ashoka-blue font-bold cursor-pointer hover:underline">HELP?</span>
                                </div>
                                <div className="relative">
                                    <div className="w-full text-center tracking-[0.2em] rounded-[1.2vmin] text-[2.5vmin] font-black py-[1vmin] px-[1.5vmin] bg-slate-50 border-[0.15vmin] border-slate-200 text-slate-800 shadow-inner flex items-center justify-center min-h-[5vmin]">
                                        {authMethod === 'fingerprint'
                                            ? (isScanning ? 'SCANNING...' : 'PLACE FINGER ON SCANNER →')
                                            : (aadhaar ? formatAadhaar(aadhaar) : (authMethod === 'aadhaar' ? '0000 0000 0000' : '00000 00000'))
                                        }
                                    </div>
                                    <div className={`absolute right-[1.5vmin] top-1/2 -translate-y-1/2 text-green-600 transition-opacity flex items-center ${aadhaar.length === (authMethod === 'aadhaar' ? 12 : 10) ? 'opacity-100' : 'opacity-0'}`}>
                                        <span className="material-symbols-outlined text-[2.2vmin] font-variation-fill-1">verified_user</span>
                                    </div>
                                    <div className="absolute left-[1.5vmin] top-1/2 -translate-y-1/2 opacity-20">
                                        <img src={aadhaarSymbol} alt="" className="w-[2.5vmin] h-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Numpad */}
                        <div className="grid grid-cols-3 gap-[0.6vmin] mb-[1.2vmin]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handleNumClick(num.toString())}
                                    disabled={authMethod === 'fingerprint'}
                                    className="h-[5vmin] flex items-center justify-center rounded-[1vmin] bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition-all text-[2.2vmin] font-bold text-slate-700 kiosk-button disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={handleDelete}
                                disabled={authMethod === 'fingerprint'}
                                className="h-[5vmin] flex items-center justify-center rounded-[1vmin] text-aadhaar-red hover:bg-red-50 active:bg-red-100 active:scale-95 transition-all border border-transparent kiosk-button disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <span className="material-symbols-outlined text-[2.5vmin]">backspace</span>
                            </button>
                            <button
                                onClick={() => handleNumClick('0')}
                                disabled={authMethod === 'fingerprint'}
                                className="h-[5vmin] flex items-center justify-center rounded-[1vmin] bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition-all text-[2.2vmin] font-bold text-slate-700 kiosk-button disabled:opacity-30 disabled:pointer-events-none"
                            >
                                0
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={authMethod === 'fingerprint'}
                                className="h-[5vmin] flex items-center justify-center rounded-[1vmin] text-ashoka-blue text-[1.1vmin] font-black tracking-widest hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all border border-transparent kiosk-button disabled:opacity-30 disabled:pointer-events-none"
                            >
                                CLEAR
                            </button>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col gap-[0.8vmin]">
                            <button
                                onClick={handleVerifyValue}
                                disabled={aadhaar.length !== (authMethod === 'aadhaar' ? 12 : 10) || authMethod === 'fingerprint'}
                                className="w-full h-[5vmin] bg-linear-to-r from-ashoka-blue to-indigo-800 text-white rounded-[1.2vmin] text-[1.8vmin] font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-[0.8vmin] group disabled:opacity-30 disabled:grayscale disabled:scale-100"
                            >
                                <span>Send OTP</span>
                                <span className="material-symbols-outlined text-[2vmin] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <div className="flex items-center justify-center gap-[0.5vmin] py-[0.3vmin] bg-slate-50 rounded-full border border-slate-100 opacity-60">
                                <span className="material-symbols-outlined text-[1.2vmin] text-green-600">lock</span>
                                <p className="text-[0.9vmin] font-bold text-slate-400 uppercase tracking-tight">Secure Connection • UIDAI Compliant</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Fingerprint Scanner Panel */}
                <div className="w-[18vmin] flex flex-col gap-[1vmin]">
                    <button
                        onClick={() => { setAuthMethod('fingerprint'); setAadhaar(''); startFingerprintScan(); }}
                        disabled={isScanning}
                        className={`flex-1 flex flex-col items-center justify-center gap-[1.5vmin] rounded-[1.5vmin] border-[0.2vmin] transition-all group bg-white shadow-xl ${isScanning ? 'border-aadhaar-red bg-red-50 text-aadhaar-red shadow-inner' : (authMethod === 'fingerprint' ? 'border-ashoka-blue bg-blue-50/30 text-ashoka-blue' : 'border-slate-200 hover:bg-white hover:border-ashoka-blue text-slate-400')}`}
                    >
                        <div className="relative">
                            <span className={`material-symbols-outlined text-[6vmin] ${isScanning ? 'animate-pulse' : (authMethod === 'fingerprint' ? 'text-ashoka-blue' : 'group-hover:text-ashoka-blue')} transition-colors font-variation-fill-1`}>fingerprint</span>
                            {isScanning && (
                                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                            )}
                        </div>
                        <div className="text-center px-[1vmin]">
                            <p className="text-[1.2vmin] font-black uppercase tracking-tighter">Fingerprint</p>
                            <p className="text-[0.9vmin] font-bold opacity-60">TAP TO SCAN</p>
                        </div>
                    </button>
                    <div className="h-[5vmin] flex items-center justify-center rounded-[1vmin] bg-ashoka-blue/5 border border-ashoka-blue/10 text-ashoka-blue gap-[0.5vmin] px-[1vmin] opacity-80">
                        <span className="material-symbols-outlined text-[1.5vmin]">security</span>
                        <span className="text-[0.8vmin] font-black uppercase">Secure Biometric</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
