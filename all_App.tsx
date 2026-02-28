import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Fingerprint,
  Zap,
  Droplet,
  Trash2,
  Flame,
  Home,
  Bus,
  HeartPulse,
  FileText,
  Search,
  Mic,
  MicOff,
  ArrowLeft,
  LogOut,
  HelpCircle,
  CheckCircle2,
  QrCode,
  Download,
  Printer,
  MessageSquare,
  Languages,
  User as UserIcon,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { Screen, User, Service, SERVICES, LanguageCode, LANGUAGES } from './types';
import { t } from './translations';
import { getAssistantGuidance, AssistantResponse, resetChatSession } from './services/geminiService';
import { getRotatedAIClient } from './services/apiClient';
import { useSpeechRecognition, useTextToSpeech } from './hooks/useSpeech';
import { playClickSound, playSuccessSound } from './services/audioService';

// --- Components ---

const Header = ({
  user,
  lang,
  setLang,
  onLogout
}: {
  user: User | null,
  lang: LanguageCode,
  setLang: (l: LanguageCode) => void,
  onLogout: () => void
}) => (
  <header className="w-full bg-white border-b-4 border-saffron shadow-md relative z-20">
    <div className="h-1.5 w-full bg-gradient-to-r from-saffron via-white to-india-green"></div>
    <div className="px-8 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-100 rounded-xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD4tAUBE6PyRxJg92iHrAhENKRL-aH9MYewhXPWNxFXDJShSOonIv9J1BqpdWFBZDMcxoaZitSsgMjgM-k09hwRuBuS8hb16_BtXESITKa52JFHw7U3rMxODWJm-sRDp5r5HwweM-Fyaq-ZuuGHOsM3KAZon-2wOG2o1BUAkqGQvhBIXlYtqrgvfBwX5mkPtKPGxuDlZuDv34k6Y98zA51pdV9lV2MQwPiZFnUhXBIKmTLgsVPRAMcSd82Fend4269mvQDe6Q_3jXZ"
            alt="Emblem"
            className="h-8 w-auto grayscale opacity-80"
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-chakra-blue leading-none">
            {t('welcome_title', lang)}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {t('welcome_subtitle', lang)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-sm kiosk-button"
          >
            <Languages size={18} className="text-saffron" />
            {LANGUAGES.find(l => l.code === lang)?.nativeName}
          </button>
          <div className="absolute right-0 top-full mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 grid grid-cols-1 max-h-96 overflow-y-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-4 py-2 text-left text-sm font-bold hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-chakra-blue bg-blue-50' : 'text-slate-600'}`}
              >
                {l.nativeName} ({l.name})
              </button>
            ))}
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500">{lang === 'hi' ? 'नमस्ते' : 'Welcome'}</p>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full bg-red-50 text-red-600 kiosk-button"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <UserIcon size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">{t('guest', lang)}</span>
          </div>
        )}
      </div>
    </div>
  </header>
);

const Footer = ({ onHelp, lang }: { onHelp: () => void, lang: LanguageCode }) => (
  <footer className="w-full bg-white border-t border-slate-200 py-4 px-8">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-saffron"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          <div className="w-2 h-2 rounded-full bg-india-green"></div>
        </div>
        <span>
          {t('footer_text', lang)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
          <Clock size={16} />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <button
          onClick={onHelp}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-chakra-blue text-white font-bold text-sm kiosk-button shadow-lg shadow-blue-200"
        >
          <HelpCircle size={18} />
          {t('help', lang)}
        </button>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const WelcomeScreen = ({ onStart, lang, setLang }: { onStart: () => void, lang: LanguageCode, setLang: (l: LanguageCode) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center text-center gap-8 h-full py-10"
  >
    <div className="relative">
      <div className="absolute -inset-8 bg-gradient-to-r from-saffron/20 via-white to-india-green/20 blur-3xl rounded-full"></div>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-orange-50"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcSD06Spv6F6N2Rk1m_xBFLNjJ_UIcD8tMr-U5cwQNiwpIy0sfask53OIMRhfZrsfz2UsKqUaOhSJc4ygdl6HYxFyn6dWxfDoXEGn2wNqA2-NuJCm801kJGX0J5Zt__aAnvZcc31WE9IGQ3mbGKl0nG6ru1VqtKWMKTQ-k1_ElBVyXEOtHes-bSUwsOl0VU7xrkCTPOUiEeD-Wi2_lp4UpVBznbg16R5_JCXz0OsyYlREWpvG2jouXENAjAtKc5X6V4HmqBp48n8Nc"
          alt="Suvidha"
          className="w-24 h-24 object-contain"
        />
      </motion.div>
    </div>

    <div className="space-y-2">
      <h2 className="text-5xl font-black text-slate-900">
        {t('welcome_title', lang)}
      </h2>
      <p className="text-xl text-slate-500 font-medium tracking-wide">
        {t('welcome_subtitle', lang)}
      </p>
    </div>

    <div className="w-full max-w-4xl space-y-6">
      <h3 className="text-xl font-bold text-slate-800">
        {t('select_language', lang)}
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`p-4 rounded-2xl border-2 transition-all kiosk-button flex flex-col items-center gap-1 ${lang === l.code
                ? 'bg-chakra-blue border-chakra-blue text-white shadow-xl scale-105'
                : 'bg-white border-slate-100 text-slate-600 hover:border-saffron'
              }`}
          >
            <span className="text-lg font-bold">{l.nativeName}</span>
            <span className="text-[10px] opacity-60 uppercase font-bold">{l.name}</span>
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={onStart}
      className="group relative flex items-center gap-4 px-12 py-6 bg-saffron text-white rounded-full font-black text-2xl shadow-2xl shadow-orange-200 kiosk-button overflow-hidden mt-4"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      <Fingerprint size={32} className="animate-pulse" />
      {t('touch_to_begin', lang)}
    </button>
  </motion.div>
);

const LoginScreen = ({ onLogin, lang }: { onLogin: (u: User) => void, lang: LanguageCode }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNumClick = (num: string) => {
    if (aadhaar.length < 12 && /^[0-9]$/.test(num)) {
      setAadhaar(prev => prev + num);
      setError(null);
    }
  };

  const handleDelete = () => {
    setAadhaar(prev => prev.slice(0, -1));
    setError(null);
  };

  const formatAadhaar = (val: string) => {
    return val.padEnd(12, '•').replace(/(.{4})/g, '$1 ').trim();
  };

  // Support physical keyboard for testing/accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aadhaar]);

  const handleVerify = () => {
    if (aadhaar.length === 12 && /^\d{12}$/.test(aadhaar)) {
      onLogin({ name: 'Rajesh Kumar', aadhaar });
    } else {
      setError(t('enter_aadhaar', lang));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center gap-8 max-w-xl mx-auto"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-red-50 rounded-full text-aadhaar-red mb-4">
          <Fingerprint size={48} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900">
          {t('aadhaar_login', lang)}
        </h2>
        <p className="text-slate-500">
          {t('enter_aadhaar', lang)}
        </p>
      </div>

      <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
        <div className="relative">
          <motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            className={`w-full text-center py-6 bg-slate-50 rounded-2xl border-2 transition-colors text-4xl font-mono tracking-widest ${error ? 'border-red-500 text-red-600' :
                aadhaar.length === 12 ? 'border-india-green text-india-green' :
                  'border-slate-200 text-slate-800'
              }`}
          >
            {formatAadhaar(aadhaar)}
          </motion.div>
          {aadhaar.length === 12 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-india-green"
            >
              <CheckCircle2 size={32} />
            </motion.div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-500 font-bold text-sm"
          >
            {error}
          </motion.p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="h-20 bg-slate-50 rounded-2xl text-2xl font-bold text-slate-700 kiosk-button hover:bg-slate-100 border border-slate-200"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => { setAadhaar(''); setError(null); }}
            className="h-20 text-slate-400 font-bold kiosk-button"
          >
            {lang === 'hi' ? 'साफ़ करें' : 'CLEAR'}
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="h-20 bg-slate-50 rounded-2xl text-2xl font-bold text-slate-700 kiosk-button hover:bg-slate-100 border border-slate-200"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-20 text-red-400 flex items-center justify-center kiosk-button"
          >
            <ArrowLeft size={32} />
          </button>
        </div>

        <button
          disabled={aadhaar.length !== 12 && !error}
          onClick={handleVerify}
          className="w-full py-6 bg-chakra-blue text-white rounded-2xl text-2xl font-bold shadow-xl shadow-blue-100 disabled:opacity-50 disabled:shadow-none transition-all kiosk-button"
        >
          {t('verify_login', lang)}
        </button>
      </div>
    </motion.div>
  );
};

const Dashboard = ({
  onSelectService,
  onTrackStatus,
  onAction,
  lang
}: {
  onSelectService: (s: Service) => void,
  onTrackStatus: () => void,
  onAction: (a: string) => void,
  lang: LanguageCode
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-10"
  >
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-slate-900">
          {t('select_service', lang)}
        </h2>
      </div>
      <button
        onClick={onTrackStatus}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-saffron text-saffron font-bold rounded-2xl kiosk-button"
      >
        <Search size={20} />
        {t('track_application', lang)}
      </button>
      <button
        onClick={() => onAction('navigate_to_creative')}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-chakra-blue text-chakra-blue font-bold rounded-2xl kiosk-button"
      >
        <Sparkles size={20} />
        {lang === 'hi' ? 'पोस्टर बनाएं' : 'Create Poster'}
      </button>
    </div>

    <div className="grid grid-cols-3 gap-8">
      {SERVICES.map(service => (
        <button
          key={service.id}
          onClick={() => onSelectService(service)}
          className="group bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all border border-slate-100 text-left flex flex-col gap-6 kiosk-button relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${service.color} opacity-5 rounded-bl-[100px]`}></div>
          <div className={`size-16 rounded-2xl ${service.color} text-white flex items-center justify-center shadow-lg`}>
            {service.id === 'electricity' && <Zap size={32} />}
            {service.id === 'water' && <Droplet size={32} />}
            {service.id === 'gas' && <Flame size={32} />}
            {service.id === 'waste' && <Trash2 size={32} />}
            {service.id === 'health' && <HeartPulse size={32} />}
            {service.id === 'certificates' && <FileText size={32} />}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {service.translations[lang].title}
            </h3>
            <p className="text-slate-500 leading-relaxed">
              {service.translations[lang].description}
            </p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-slate-400 font-bold text-sm group-hover:text-chakra-blue transition-colors">
            {lang === 'hi' ? 'आगे बढ़ें' : 'Proceed'}
            <ChevronRight size={16} />
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

const ServiceDetail = ({
  service,
  onBack,
  onSubmit,
  lang
}: {
  service: Service,
  onBack: () => void,
  onSubmit: () => void,
  lang: LanguageCode
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const ai = getRotatedAIClient();

        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: "Analyze this document. Is it a valid government ID or utility bill? Extract the name and address if possible." }
            ]
          }
        });

        setAnalysisResult(response.text || "Analysis complete.");
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold kiosk-button">
        <ArrowLeft size={20} />
        {t('go_back', lang)}
      </button>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-10">
        <div className="flex items-center gap-6">
          <div className={`size-20 rounded-3xl ${service.color} text-white flex items-center justify-center shadow-xl`}>
            {service.id === 'electricity' && <Zap size={40} />}
            {service.id === 'water' && <Droplet size={40} />}
            {service.id === 'gas' && <Flame size={40} />}
            {service.id === 'waste' && <Trash2 size={40} />}
            {service.id === 'health' && <HeartPulse size={40} />}
            {service.id === 'certificates' && <FileText size={40} />}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              {service.translations[lang].title}
            </h2>
            <p className="text-xl text-slate-500">
              {t('new_connection_msg', lang)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
              {t('service_type', lang)}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { en: 'New Connection', hi: 'नया कनेक्शन' },
                { en: 'Bill Payment', hi: 'बिल भुगतान' },
                { en: 'Complaint', hi: 'शिकायत' },
                { en: 'Maintenance', hi: 'रखरखाव' }
              ].map(opt => (
                <button key={opt.en} className="w-full p-5 text-left bg-slate-50 rounded-2xl border-2 border-transparent hover:border-chakra-blue transition-all font-bold text-slate-700 kiosk-button">
                  {lang === 'hi' ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <label className="block cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              <div className="p-8 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-4 text-center hover:bg-blue-100 transition-colors">
                <div className="p-4 bg-white rounded-full text-chakra-blue shadow-sm">
                  {analyzing ? <div className="animate-spin"><Clock size={32} /></div> : <Download size={32} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {analyzing ? t('analyzing', lang) : t('upload_docs', lang)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">ID Proof, Address Proof (Max 5MB)</p>
                </div>
              </div>
            </label>

            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-green-50 border border-green-100 rounded-2xl text-xs text-green-800 font-medium"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} />
                  <span className="font-bold">AI Verification Result:</span>
                </div>
                {analysisResult}
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-6 bg-india-green text-white rounded-2xl text-2xl font-bold shadow-xl shadow-green-100 kiosk-button flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('submitting', lang)}
                </>
              ) : (
                t('submit_request', lang)
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatusScreen = ({ onBack, lang }: { onBack: () => void, lang: LanguageCode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-4xl mx-auto space-y-8"
  >
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold kiosk-button">
      <ArrowLeft size={20} />
      {t('go_back', lang)}
    </button>

    <div className="text-center space-y-4">
      <h2 className="text-5xl font-bold text-slate-900">
        {t('track_application', lang)}
      </h2>
      <p className="text-xl text-slate-500">ARN-2023-8899-0012</p>
    </div>

    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
      <div className="relative space-y-12">
        <div className="absolute left-7 top-4 bottom-4 w-1 bg-slate-100 rounded-full">
          <div className="h-2/3 w-full bg-india-green rounded-full"></div>
        </div>

        {[
          { title: 'Submitted', titleHi: 'जमा किया गया', date: 'Oct 24, 2023', dateHi: '24 अक्टूबर, 2023', status: 'completed', icon: <CheckCircle2 /> },
          { title: 'Verification', titleHi: 'सत्यापन', date: 'Oct 25, 2023', dateHi: '25 अक्टूबर, 2023', status: 'completed', icon: <CheckCircle2 /> },
          { title: 'Field Inspection', titleHi: 'क्षेत्र निरीक्षण', date: 'In Progress', dateHi: 'प्रगति पर है', status: 'active', icon: <Clock /> },
          { title: 'Final Approval', titleHi: 'अंतिम स्वीकृति', date: 'Pending', dateHi: 'लंबित', status: 'pending', icon: <QrCode /> },
        ].map((step, i) => (
          <div key={i} className="flex gap-8 items-start relative z-10">
            <div className={`size-14 rounded-full flex items-center justify-center shadow-lg ring-8 ring-white ${step.status === 'completed' ? 'bg-india-green text-white' :
                step.status === 'active' ? 'bg-saffron text-white animate-pulse' :
                  'bg-slate-100 text-slate-400'
              }`}>
              {step.icon}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                  {lang === 'hi' ? step.titleHi : step.title}
                </h3>
                <span className={`text-sm font-bold ${step.status === 'completed' ? 'text-india-green' : 'text-slate-400'}`}>
                  {lang === 'hi' ? step.dateHi : step.date}
                </span>
              </div>
              {step.status === 'active' && (
                <p className="text-slate-500 mt-1">
                  {lang === 'hi' ? 'निरीक्षण के लिए साइट इंजीनियर नियुक्त किया गया है।' : 'Site engineer has been assigned for inspection.'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const SuccessScreen = ({ onFinish, lang }: { onFinish: () => void, lang: LanguageCode }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onFinish();
    }
  }, [countdown, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto text-center space-y-12"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="size-32 bg-india-green rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
          <CheckCircle2 size={64} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-6xl font-black text-slate-900">
          {t('thank_you', lang)}
        </h2>
        <p className="text-2xl text-slate-500 font-medium">
          {t('success_msg', lang)}
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center gap-8">
        <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
          <QrCode size={160} className="text-slate-800" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-bold text-slate-800">{lang === 'hi' ? 'रसीद डाउनलोड करें' : 'Download Receipt'}</p>
          <p className="text-sm text-slate-400">{lang === 'hi' ? 'अपने फोन से स्कैन करें' : 'Scan with your phone'}</p>
        </div>

        <div className="flex gap-4 w-full">
          <button className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 kiosk-button">
            <Printer size={20} />
            {lang === 'hi' ? 'प्रिंट करें' : 'Print'}
          </button>
          <button className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 kiosk-button">
            <Download size={20} />
            {lang === 'hi' ? 'डाउनलोड' : 'Download'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-slate-400 font-bold">
        <div className="size-10 rounded-full border-4 border-slate-200 border-t-saffron animate-spin"></div>
        {t('returning_home', lang)} {countdown}s...
      </div>
    </motion.div>
  );
};

// --- Assistant Component ---

const VoiceAssistant = ({
  currentScreen,
  lang,
  onAction
}: {
  currentScreen: Screen,
  lang: LanguageCode,
  onAction: (action: string, params?: any) => void
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [history, setHistory] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const prevScreenRef = useRef<Screen>(currentScreen);

  // Unlock audio on first interaction
  useEffect(() => {
    const unlock = () => {
      setHasInteracted(true);
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Proactive help on screen change
  useEffect(() => {
    if (!hasInteracted) return;

    const triggerProactive = async () => {
      const proactive = await import('./services/geminiService').then(m => m.getProactiveHelp(currentScreen, lang, history));
      if (proactive.text) {
        setLastResponse(proactive.text);
        speak(proactive.text, lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-US' : lang);
      }
    };
    triggerProactive();
  }, [currentScreen, lang, hasInteracted]);

  // Login success audio feedback
  useEffect(() => {
    if (prevScreenRef.current === 'login' && currentScreen === 'dashboard') {
      playSuccessSound();
    }
    prevScreenRef.current = currentScreen;
  }, [currentScreen]);

  const handleVoiceResult = async (text: string) => {
    setIsProcessing(true);
    setHistory(prev => [...prev, `User: ${text}`]);
    try {
      const response = await import('./services/geminiService').then(m => m.getAssistantGuidance(text, currentScreen, lang, history));
      setLastResponse(response.text);
      setHistory(prev => [...prev, `Assistant: ${response.text}`]);
      speak(response.text, lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-US' : lang);

      if (response.action) {
        onAction(response.action, response.params);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const { isListening, startListening } = useSpeechRecognition(handleVoiceResult);

  return (
    <div className="fixed bottom-24 right-8 flex flex-col items-end gap-4 z-50">
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="max-w-xs bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 text-sm font-medium text-slate-700 relative"
          >
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100"></div>
            {lastResponse}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          if (isSpeaking) {
            stop();
          } else {
            startListening();
          }
        }}
        disabled={isListening || isProcessing}
        className={`size-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all kiosk-button relative ${isListening ? 'bg-red-500 scale-110' :
            isSpeaking ? 'bg-chakra-blue' :
              isProcessing ? 'bg-saffron' :
                'bg-india-green'
          }`}
      >
        {isSpeaking ? (
          <div className="flex items-center gap-1 h-8">
            <motion.div animate={{ height: [10, 24, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 bg-white rounded-full" />
            <motion.div animate={{ height: [15, 32, 15] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 bg-white rounded-full" />
            <motion.div animate={{ height: [10, 24, 10] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 bg-white rounded-full" />
          </div>
        ) : isProcessing ? (
          <div className="flex gap-1">
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-white rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
          </div>
        ) : isListening ? (
          <MicOff size={32} />
        ) : (
          <Mic size={32} />
        )}

        {(isListening || isSpeaking) && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
            />
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
              className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
            />
            <motion.div
              animate={{ scale: [1, 2.1], opacity: [0.1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1 }}
              className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-500' : 'border-chakra-blue'}`}
            />
          </>
        )}
      </button>
    </div>
  );
};

const PosterGenerator = ({ lang }: { lang: LanguageCode }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const ai = getRotatedAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A professional civic awareness poster for ${prompt}. Style: Modern, clean, governmental.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 text-chakra-blue mb-4">
        <Sparkles size={24} />
        <h3 className="text-2xl font-bold">{t('create_poster', lang)}</h3>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('enter_topic', lang)}
          className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium"
        />

        <div className="flex flex-wrap gap-2">
          {['1:1', '3:4', '4:3', '9:16', '16:9'].map(ratio => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${aspectRatio === ratio ? 'bg-chakra-blue text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 italic">
          {lang === 'hi' ? '* पोस्टर एआई द्वारा बनाया जाएगा' : '* Poster will be generated by AI'}
        </p>

        <button
          onClick={handleGenerate}
          disabled={generating || !prompt}
          className="w-full py-4 bg-saffron text-white rounded-xl font-bold shadow-lg disabled:opacity-50 kiosk-button"
        >
          {generating ? t('generating', lang) : t('create_poster', lang)}
        </button>
      </div>

      {imageUrl && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
          <img src={imageUrl} alt="Generated Poster" className="w-full rounded-2xl shadow-lg border border-slate-200" />
        </motion.div>
      )}
    </div>
  );
};

const WasteManagementDashboard = ({ lang, onBack, onAction }: { lang: LanguageCode, onBack: () => void, onAction: (action: string, params?: any) => void }) => {
  return (
    <div className="h-full flex flex-col space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold kiosk-button w-fit">
        <ArrowLeft size={20} />
        {t('go_back', lang)}
      </button>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">{t('waste_management_title', lang)}</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-1 w-12 bg-saffron rounded-full"></div>
          <p className="text-india-green font-bold text-xl">{t('swachh_bharat_tagline', lang)}</p>
          <div className="h-1 w-12 bg-india-green rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Card 1: Waste Collection */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-india-green transition-all cursor-pointer flex flex-col items-center text-center space-y-6 kiosk-button"
          onClick={() => onAction('navigate_to_service', { serviceId: 'waste' })}
        >
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
            <Trash2 size={48} className="text-india-green" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{t('waste_collection', lang)}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{t('waste_collection_desc', lang)}</p>
          <button className="mt-auto px-8 py-3 bg-india-green text-white font-bold rounded-xl w-full">
            {t('request_now', lang)}
          </button>
        </motion.div>

        {/* Card 2: Bulk Pickup */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-saffron transition-all cursor-pointer flex flex-col items-center text-center space-y-6 kiosk-button"
          onClick={() => onAction('navigate_to_service', { serviceId: 'waste' })}
        >
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
            <Bus size={48} className="text-saffron" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{t('bulk_waste_pickup', lang)}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{t('bulk_waste_pickup_desc', lang)}</p>
          <button className="mt-auto px-8 py-3 bg-saffron text-white font-bold rounded-xl w-full">
            {t('book_now', lang)}
          </button>
        </motion.div>

        {/* Card 3: New Dustbin */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-chakra-blue transition-all cursor-pointer flex flex-col items-center text-center space-y-6 kiosk-button"
          onClick={() => onAction('navigate_to_service', { serviceId: 'waste' })}
        >
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <Trash2 size={48} className="text-chakra-blue" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{t('new_dustbin_request', lang)}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{t('new_dustbin_request_desc', lang)}</p>
          <button className="mt-auto px-8 py-3 bg-chakra-blue text-white font-bold rounded-xl w-full">
            {t('apply_now', lang)}
          </button>
        </motion.div>
      </div>

      <div className="bg-green-50/50 rounded-3xl p-10 border border-green-100 flex items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <HelpCircle className="text-india-green" />
            {t('help_info', lang)}
          </h2>
          <ul className="space-y-4">
            {[
              { icon: <CheckCircle2 size={20} className="text-india-green" />, text: t('collection_time', lang) },
              { icon: <CheckCircle2 size={20} className="text-india-green" />, text: t('segregation_rules', lang) },
              { icon: <CheckCircle2 size={20} className="text-india-green" />, text: t('resolution_timeline', lang) }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                {item.icon}
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center space-y-3">
          <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <QrCode size={64} className="text-slate-300" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('scan_for_help', lang)}</p>
            <p className="text-sm font-bold text-india-green">{t('swachh_bharat_app', lang)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [lang, setLang] = useState<LanguageCode>('hi');

  // Global click sound for kiosk-button
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

  // Play success sound on screen change to success
  useEffect(() => {
    if (screen === 'success') {
      playSuccessSound();
    }
  }, [screen]);

  const handleAction = (action: string, params?: any) => {
    switch (action) {
      case 'navigate_to_login': setScreen('login'); break;
      case 'navigate_to_dashboard': setScreen('dashboard'); break;
      case 'navigate_to_waste_dashboard': setScreen('waste_dashboard'); break;
      case 'navigate_to_creative': setScreen('creative'); break;
      case 'navigate_to_service':
        if (params?.serviceId) {
          const s = SERVICES.find(sv => sv.id === params.serviceId);
          if (s) {
            setSelectedService(s);
            setScreen('service_detail');
          }
        }
        break;
      case 'navigate_to_status': setScreen('status'); break;
      case 'navigate_to_welcome': setScreen('welcome'); break;
      case 'go_back':
        if (screen === 'service_detail') {
          if (selectedService?.id === 'waste') setScreen('waste_dashboard');
          else setScreen('dashboard');
        }
        else if (screen === 'waste_dashboard') setScreen('dashboard');
        else if (screen === 'status') setScreen('dashboard');
        else if (screen === 'login') setScreen('welcome');
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans">
      <Header
        user={user}
        lang={lang}
        setLang={setLang}
        onLogout={() => {
          setUser(null);
          setScreen('welcome');
          resetChatSession();
        }}
      />

      <main className="flex-1 relative overflow-hidden px-8 py-12">
        <div className="max-w-7xl mx-auto h-full">
          <AnimatePresence mode="wait">
            {screen === 'welcome' && (
              <motion.div key="welcome" className="h-full">
                <WelcomeScreen lang={lang} setLang={setLang} onStart={() => setScreen('login')} />
              </motion.div>
            )}
            {screen === 'login' && (
              <motion.div key="login" className="h-full">
                <LoginScreen lang={lang} onLogin={(u) => { setUser(u); setScreen('dashboard'); }} />
              </motion.div>
            )}
            {screen === 'dashboard' && (
              <motion.div key="dashboard" className="h-full">
                <Dashboard
                  lang={lang}
                  onSelectService={(s) => {
                    setSelectedService(s);
                    if (s.id === 'waste') setScreen('waste_dashboard');
                    else setScreen('service_detail');
                  }}
                  onTrackStatus={() => setScreen('status')}
                  onAction={handleAction}
                />
              </motion.div>
            )}
            {screen === 'waste_dashboard' && (
              <motion.div key="waste_dashboard" className="h-full">
                <WasteManagementDashboard
                  lang={lang}
                  onBack={() => setScreen('dashboard')}
                  onAction={handleAction}
                />
              </motion.div>
            )}
            {screen === 'service_detail' && selectedService && (
              <motion.div key="service" className="h-full">
                <ServiceDetail
                  lang={lang}
                  service={selectedService}
                  onBack={() => setScreen('dashboard')}
                  onSubmit={() => setScreen('success')}
                />
              </motion.div>
            )}
            {screen === 'status' && (
              <motion.div key="status" className="h-full">
                <StatusScreen lang={lang} onBack={() => setScreen('dashboard')} />
              </motion.div>
            )}
            {screen === 'creative' && (
              <motion.div key="creative" className="h-full">
                <div className="max-w-4xl mx-auto space-y-8">
                  <button onClick={() => setScreen('dashboard')} className="flex items-center gap-2 text-slate-500 font-bold kiosk-button">
                    <ArrowLeft size={20} />
                    {lang === 'hi' ? 'वापस जाएं' : 'Go Back'}
                  </button>
                  <PosterGenerator lang={lang} />
                </div>
              </motion.div>
            )}
            {screen === 'success' && (
              <motion.div key="success" className="h-full">
                <SuccessScreen lang={lang} onFinish={() => setScreen('welcome')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer lang={lang} onHelp={() => alert(lang === 'hi' ? 'सहायता केंद्र से संपर्क किया जा रहा है...' : 'Contacting help center...')} />

      <VoiceAssistant
        currentScreen={screen}
        lang={lang}
        onAction={handleAction}
      />
    </div>
  );
}
