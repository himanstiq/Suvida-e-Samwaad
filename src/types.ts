export type Screen = 'welcome' | 'login' | 'dashboard' | 'service_dashboard' | 'service_detail' | 'status' | 'success' | 'creative';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';

export interface Language {
    code: LanguageCode;
    name: string;
    nativeName: string;
}

export const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

export interface User {
    name: string;
    aadhaar: string;
}

/** A sub-service option within a parent service (e.g. "Bill Payment" under Electricity) */
export interface SubService {
    id: string;
    /** Material Symbols icon name */
    icon: string;
    /** Tailwind bg-* class for the icon container */
    color: string;
    /** Translation key for the CTA button label (e.g. 'request_now', 'apply_now') */
    actionLabelKey: string;
    translations: {
        [key in LanguageCode]: {
            title: string;
            description: string;
        }
    };
}

export interface Service {
    id: string;
    icon: string;
    color: string;
    subServices: SubService[];
    translations: {
        [key in LanguageCode]: {
            title: string;
            description: string;
        }
    };
}

export const SERVICES: Service[] = [
    {
        id: 'electricity',
        icon: 'zap',
        color: 'bg-blue-500',
        subServices: [
            { id: 'new-connection', icon: 'electrical_services', color: 'bg-blue-500', actionLabelKey: 'apply_now', translations: { en: { title: 'New Connection', description: 'Apply for a new electricity connection' }, hi: { title: 'नया कनेक्शन', description: 'नया बिजली कनेक्शन के लिए आवेदन करें' }, bn: { title: 'নতুন সংযোগ', description: 'নতুন বিদ্যুৎ সংযোগের জন্য আবেদন করুন' }, te: { title: 'కొత్త కనెక్షన్', description: 'కొత్త విద్యుత్ కనెక్షన్ కోసం దరఖాస్తు చేయండి' }, mr: { title: 'नवीन कनेक्शन', description: 'नवीन वीज कनेक्शनसाठी अर्ज करा' }, ta: { title: 'புதிய இணைப்பு', description: 'புதிய மின் இணைப்புக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'નવું કનેક્શન', description: 'નવા વીજળી કનેક્શન માટે અરજી કરો' }, kn: { title: 'ಹೊಸ ಸಂಪರ್ಕ', description: 'ಹೊಸ ವಿದ್ಯುತ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'പുതിയ കണക്ഷൻ', description: 'പുതിയ വൈദ്യുതി കണക്ഷനു അപേക്ഷിക്കുക' }, pa: { title: 'ਨਵਾਂ ਕਨੈਕਸ਼ਨ', description: 'ਨਵੇਂ ਬਿਜਲੀ ਕਨੈਕਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
            { id: 'bill-payment', icon: 'receipt_long', color: 'bg-emerald-500', actionLabelKey: 'request_now', translations: { en: { title: 'Bill Payment', description: 'Pay your electricity bill online' }, hi: { title: 'बिल भुगतान', description: 'अपना बिजली बिल ऑनलाइन भरें' }, bn: { title: 'বিল পেমেন্ট', description: 'আপনার বিদ্যুৎ বিল অনলাইনে পরিশোধ করুন' }, te: { title: 'బిల్లు చెల్లింపు', description: 'మీ విద్యుత్ బిల్లును ఆన్‌లైన్‌లో చెల్లించండి' }, mr: { title: 'बिल भरणे', description: 'तुमचे वीज बिल ऑनलाइन भरा' }, ta: { title: 'பில் செலுத்துதல்', description: 'உங்கள் மின் கட்டணத்தை ஆன்லைனில் செலுத்தவும்' }, gu: { title: 'બિલ ચુકવણી', description: 'તમારું વીજળી બિલ ઓનલાઈન ચૂકવો' }, kn: { title: 'ಬಿಲ್ ಪಾವತಿ', description: 'ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ' }, ml: { title: 'ബിൽ പേയ്മെന്റ്', description: 'നിങ്ങളുടെ വൈദ്യുതി ബിൽ ഓൺലൈനായി അടയ്ക്കുക' }, pa: { title: 'ਬਿੱਲ ਭੁਗਤਾਨ', description: 'ਆਪਣਾ ਬਿਜਲੀ ਬਿੱਲ ਔਨਲਾਈਨ ਭਰੋ' } } },
            { id: 'complaint', icon: 'report_problem', color: 'bg-amber-500', actionLabelKey: 'request_now', translations: { en: { title: 'Complaint', description: 'File a complaint about power issues' }, hi: { title: 'शिकायत', description: 'बिजली की समस्या की शिकायत दर्ज करें' }, bn: { title: 'অভিযোগ', description: 'বিদ্যুৎ সমস্যা সম্পর্কে অভিযোগ করুন' }, te: { title: 'ఫిర్యాదు', description: 'విద్యుత్ సమస్యల గురించి ఫిర్యాదు చేయండి' }, mr: { title: 'तक्रार', description: 'वीज समस्येबद्दल तक्रार नोंदवा' }, ta: { title: 'புகார்', description: 'மின் சிக்கல்கள் குறித்து புகார் அளிக்கவும்' }, gu: { title: 'ફરિયાદ', description: 'વીજળી સમસ્યાઓ વિશે ફરિયાદ કરો' }, kn: { title: 'ದೂರು', description: 'ವಿದ್ಯುತ್ ಸಮಸ್ಯೆಗಳ ಬಗ್ಗೆ ದೂರು ನೀಡಿ' }, ml: { title: 'പരാതി', description: 'വൈദ്യുതി പ്രശ്നങ്ങളെക്കുറിച്ച് പരാതി നൽകുക' }, pa: { title: 'ਸ਼ਿਕਾਇਤ', description: 'ਬਿਜਲੀ ਸਮੱਸਿਆਵਾਂ ਬਾਰੇ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ' } } },
        ],
        translations: {
            en: { title: 'Electricity', description: 'Bill payment, new connection, complaints' },
            hi: { title: 'बिजली', description: 'बिल भुगतान, नया कनेक्शन, शिकायत दर्ज करें' },
            bn: { title: 'বিদ্যুৎ', description: 'বিল পেমেন্ট, নতুন সংযোগ, অভিযোগ' },
            te: { title: 'విద్యుత్', description: 'బిల్లు చెల్లింపు, కొత్త కనెక్షన్, ఫిర్యాదులు' },
            mr: { title: 'वीज', description: 'बिल भरणे, नवीन कनेक्शन, तक्रारी' },
            ta: { title: 'மின்சாரம்', description: 'பில் செலுத்துதல், புதிய இணைப்பு, புகார்கள்' },
            gu: { title: 'વીજળી', description: 'બિલ ચુકવણી, નવું કનેક્શન, ફરિયાદો' },
            kn: { title: 'ವಿದ್ಯುತ್', description: 'ಬಿಲ್ ಪಾವತಿ, ಹೊಸ ಸಂಪರ್ಕ, ದೂರುಗಳು' },
            ml: { title: 'വൈദ്യുതി', description: 'ബിൽ പേയ്മെന്റ്, പുതിയ കണക്ഷൻ, പരാതികൾ' },
            pa: { title: 'ਬਿਜਲੀ', description: 'ਬਿੱਲ ਭੁਗਤਾਨ, ਨਵਾਂ ਕਨੈਕਸ਼ਨ, ਸ਼ਿਕਾਇਤਾਂ' }
        }
    },
    {
        id: 'water',
        icon: 'droplet',
        color: 'bg-cyan-500',
        subServices: [
            { id: 'new-connection', icon: 'water_drop', color: 'bg-cyan-500', actionLabelKey: 'apply_now', translations: { en: { title: 'New Connection', description: 'Apply for a new water supply connection' }, hi: { title: 'नया कनेक्शन', description: 'नया पानी कनेक्शन के लिए आवेदन करें' }, bn: { title: 'নতুন সংযোগ', description: 'নতুন জল সরবরাহ সংযোগের জন্য আবেদন করুন' }, te: { title: 'కొత్త కనెక్షన్', description: 'కొత్త నీటి సరఫరా కనెక్షన్ కోసం దరఖాస్తు చేయండి' }, mr: { title: 'नवीन कनेक्शन', description: 'नवीन पाणी कनेक्शनसाठी अर्ज करा' }, ta: { title: 'புதிய இணைப்பு', description: 'புதிய நீர் இணைப்புக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'નવું કનેક્શન', description: 'નવા પાણી કનેક્શન માટે અરજી કરો' }, kn: { title: 'ಹೊಸ ಸಂಪರ್ಕ', description: 'ಹೊಸ ನೀರು ಸಂಪರ್ಕಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'പുതിയ കണക്ഷൻ', description: 'പുതിയ ജല കണക്ഷൻ അപേക്ഷിക്കുക' }, pa: { title: 'ਨਵਾਂ ਕਨੈਕਸ਼ਨ', description: 'ਨਵੇਂ ਪਾਣੀ ਕਨੈਕਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
            { id: 'bill-payment', icon: 'receipt_long', color: 'bg-emerald-500', actionLabelKey: 'request_now', translations: { en: { title: 'Bill Payment', description: 'Pay your water bill online' }, hi: { title: 'बिल भुगतान', description: 'अपना पानी बिल ऑनलाइन भरें' }, bn: { title: 'বিল পেমেন্ট', description: 'আপনার জলের বিল অনলাইনে পরিশোধ করুন' }, te: { title: 'బిల్లు చెల్లింపు', description: 'మీ నీటి బిల్లును ఆన్‌లైన్‌లో చెల్లించండి' }, mr: { title: 'बिल भरणे', description: 'तुमचे पाणी बिल ऑनलाइन भरा' }, ta: { title: 'பில் செலுத்துதல்', description: 'உங்கள் நீர் கட்டணத்தை ஆன்லைனில் செலுத்தவும்' }, gu: { title: 'બિલ ચુકવણી', description: 'તમારું પાણી બિલ ઓનલાઈન ચૂકવો' }, kn: { title: 'ಬಿಲ್ ಪಾವತಿ', description: 'ನಿಮ್ಮ ನೀರಿನ ಬಿಲ್ ಆನ್‌ಲೈನ್ ಪಾವತಿಸಿ' }, ml: { title: 'ബിൽ പേയ്മെന്റ്', description: 'നിങ്ങളുടെ ജല ബിൽ ഓൺലൈനായി അടയ്ക്കുക' }, pa: { title: 'ਬਿੱਲ ਭੁਗਤਾਨ', description: 'ਆਪਣਾ ਪਾਣੀ ਬਿੱਲ ਔਨਲਾਈਨ ਭਰੋ' } } },
            { id: 'supply-status', icon: 'timeline', color: 'bg-blue-400', actionLabelKey: 'request_now', translations: { en: { title: 'Supply Status', description: 'Check water supply schedule and status' }, hi: { title: 'आपूर्ति स्थिति', description: 'पानी की आपूर्ति अनुसूची और स्थिति जांचें' }, bn: { title: 'সরবরাহের স্থিতি', description: 'জল সরবরাহের সময়সূচী ও স্থিতি দেখুন' }, te: { title: 'సరఫరా స్థితి', description: 'నీటి సరఫరా షెడ్యూల్ మరియు స్థితిని తనిఖీ చేయండి' }, mr: { title: 'पुरवठा स्थिती', description: 'पाणी पुरवठा वेळापत्रक व स्थिती तपासा' }, ta: { title: 'விநியோக நிலை', description: 'நீர் விநியோக அட்டவணை மற்றும் நிலையைப் பாருங்கள்' }, gu: { title: 'સપ્લાય સ્ટેટસ', description: 'પાણી સપ્લાય શેડ્યૂલ અને સ્ટેટસ ચકાસો' }, kn: { title: 'ಪೂರೈಕೆ ಸ್ಥಿತಿ', description: 'ನೀರು ಪೂರೈಕೆ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ' }, ml: { title: 'വിതരണ നില', description: 'ജല വിതരണ ഷെഡ്യൂളും നിലയും പരിശോധിക്കുക' }, pa: { title: 'ਸਪਲਾਈ ਸਥਿਤੀ', description: 'ਪਾਣੀ ਸਪਲਾਈ ਸ਼ੈਡਿਊਲ ਅਤੇ ਸਥਿਤੀ ਦੇਖੋ' } } },
        ],
        translations: {
            en: { title: 'Water', description: 'Bill payment, meter reading, supply status' },
            hi: { title: 'पानी', description: 'बिल भुगतान, मीटर रीडिंग, आपूर्ति स्थिति' },
            bn: { title: 'জল', description: 'বিল পেমেন্ট, মিটার রিডিং, সরবরাহের স্থিতি' },
            te: { title: 'నీరు', description: 'బిల్లు చెల్లింపు, మీటర్ రీడింగ్, సరఫరా స్థితి' },
            mr: { title: 'पाणी', description: 'बिल भरणे, मीटर रीडिंग, पुरवठा स्थिती' },
            ta: { title: 'தண்ணீர்', description: 'பில் செலுத்துதல், மீட்டர் ரீடிங், விநியோக நிலை' },
            gu: { title: 'પાણી', description: 'બિલ ચુકવણી, મીટર રીડિંગ, સપ્લાય સ્ટેટસ' },
            kn: { title: 'ನೀರು', description: 'ಬಿಲ್ ಪಾವತಿ, ಮೀಟರ್ ರೀಡಿಂಗ್, ಪೂರೈಕೆ ಸ್ಥಿತಿ' },
            ml: { title: 'വെള്ളം', description: 'ബിൽ പേയ്മെന്റ്, മീറ്റർ റീഡിംഗ്, വിതരണ നില' },
            pa: { title: 'ਪਾਣੀ', description: 'ਬਿੱਲ ਭੁਗਤਾਨ, ਮੀਟਰ ਰੀਡਿੰਗ, ਸਪਲਾਈ ਸਥਿਤੀ' }
        }
    },
    {
        id: 'gas',
        icon: 'flame',
        color: 'bg-orange-600',
        subServices: [
            { id: 'refill-booking', icon: 'local_gas_station', color: 'bg-orange-500', actionLabelKey: 'book_now', translations: { en: { title: 'Refill Booking', description: 'Book an LPG cylinder refill' }, hi: { title: 'रिफिल बुकिंग', description: 'एलपीजी सिलेंडर रिफिल बुक करें' }, bn: { title: 'রিফিল বুকিং', description: 'এলপিজি সিলিন্ডার রিফিল বুক করুন' }, te: { title: 'రీఫిల్ బుకింగ్', description: 'LPG సిలిండర్ రీఫిల్ బుక్ చేయండి' }, mr: { title: 'रिफिल बुकिंग', description: 'एलपीजी सिलिंडर रिफिल बुक करा' }, ta: { title: 'ரீஃபில் புக்கிங்', description: 'LPG சிலிண்டர் ரீஃபில் புக் செய்யுங்கள்' }, gu: { title: 'રિફિલ બુકિંગ', description: 'LPG સિલિન્ડર રિફિલ બુક કરો' }, kn: { title: 'ರಿಫಿಲ್ ಬುಕಿಂಗ್', description: 'LPG ಸಿಲಿಂಡರ್ ರಿಫಿಲ್ ಬುಕ್ ಮಾಡಿ' }, ml: { title: 'റീഫിൽ ബുക്കിംഗ്', description: 'LPG സിലിണ്ടർ റീഫിൽ ബുക്ക് ചെയ്യുക' }, pa: { title: 'ਰਿਫਿਲ ਬੁਕਿੰਗ', description: 'LPG ਸਿਲੰਡਰ ਰਿਫਿਲ ਬੁੱਕ ਕਰੋ' } } },
            { id: 'new-connection', icon: 'add_circle', color: 'bg-amber-500', actionLabelKey: 'apply_now', translations: { en: { title: 'New Connection', description: 'Apply for a new gas connection' }, hi: { title: 'नया कनेक्शन', description: 'नया गैस कनेक्शन के लिए आवेदन करें' }, bn: { title: 'নতুন সংযোগ', description: 'নতুন গ্যাস সংযোগের জন্য আবেদন করুন' }, te: { title: 'కొత్త కనెక్షన్', description: 'కొత్త గ్యాస్ కనెక్షన్ కోసం దరఖాస్తు చేయండి' }, mr: { title: 'नवीन कनेक्शन', description: 'नवीन गॅस कनेक्शनसाठी अर्ज करा' }, ta: { title: 'புதிய இணைப்பு', description: 'புதிய எரிவாயு இணைப்புக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'નવું કનેક્શન', description: 'નવા ગેસ કનેક્શન માટે અરજી કરો' }, kn: { title: 'ಹೊಸ ಸಂಪರ್ಕ', description: 'ಹೊಸ ಗ್ಯಾಸ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'പുതിയ കണക്ഷൻ', description: 'പുതിയ ഗ്യാസ് കണക്ഷൻ അപേക്ഷിക്കുക' }, pa: { title: 'ਨਵਾਂ ਕਨੈਕਸ਼ਨ', description: 'ਨਵੇਂ ਗੈਸ ਕਨੈਕਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
            { id: 'leakage-report', icon: 'warning', color: 'bg-red-500', actionLabelKey: 'request_now', translations: { en: { title: 'Leakage Report', description: 'Report a gas leakage emergency' }, hi: { title: 'रिसाव रिपोर्ट', description: 'गैस रिसाव की आपातकालीन रिपोर्ट करें' }, bn: { title: 'লিকেজ রিপোর্ট', description: 'গ্যাস লিকেজ জরুরি রিপোর্ট করুন' }, te: { title: 'లీకేజీ రిపోర్ట్', description: 'గ్యాస్ లీకేజీ అత్యవసర రిపోర్ట్ చేయండి' }, mr: { title: 'गळती अहवाल', description: 'गॅस गळतीची आपत्कालीन तक्रार करा' }, ta: { title: 'கசிவு அறிக்கை', description: 'எரிவாயு கசிவு அவசர அறிக்கை செய்யுங்கள்' }, gu: { title: 'લિકેજ રિપોર્ટ', description: 'ગેસ લિકેજ ઇમરજન્સી રિપોર્ટ કરો' }, kn: { title: 'ಸೋರಿಕೆ ವರದಿ', description: 'ಗ್ಯಾಸ್ ಸೋರಿಕೆ ತುರ್ತು ವರದಿ ಮಾಡಿ' }, ml: { title: 'ചോർച്ച റിപ്പോർട്ട്', description: 'ഗ്യാസ് ചോർച്ച അടിയന്തര റിപ്പോർട്ട് ചെയ്യുക' }, pa: { title: 'ਲੀਕੇਜ ਰਿਪੋਰਟ', description: 'ਗੈਸ ਲੀਕੇਜ ਐਮਰਜੈਂਸੀ ਰਿਪੋਰਟ ਕਰੋ' } } },
        ],
        translations: {
            en: { title: 'Gas Bookings', description: 'Refill booking, new connection, leakage report' },
            hi: { title: 'गैस बुकिंग', description: 'रिफिल बुकिंग, नया कनेक्शन, रिसाव रिपोर्ट' },
            bn: { title: 'গ্যাস বুকিং', description: 'রিফিল বুকিং, নতুন সংযোগ, লিকেজ রিপোর্ট' },
            te: { title: 'గ్యాస్ బుకింగ్', description: 'రీఫిల్ బుకింగ్, కొత్త కనెక్షన్, లీకేజీ రిపోర్ట్' },
            mr: { title: 'गॅस बुकिंग', description: 'रिफिल बुकिंग, नवीन कनेक्शन, गळती अहवाल' },
            ta: { title: 'கேஸ் புக்கிங்', description: 'ரீஃபில் புக்கிங், புதிய இணைப்பு, கசிவு அறிக்கை' },
            gu: { title: 'ગેસ બુકિંગ', description: 'રિફિલ બુકિંગ, નવું કનેક્શન, લિકેજ રિપોર્ટ' },
            kn: { title: 'ಗ್ಯಾಸ್ ಬುಕಿಂಗ್', description: 'ರಿಫಿಲ್ ಬುಕಿಂಗ್, ಹೊಸ ಸಂಪರ್ಕ, ಸೋರಿಕೆ ವರದಿ' },
            ml: { title: 'ഗ്യാസ് ബുക്കിംഗ്', description: 'റീഫിൽ ബുക്കിംഗ്, പുതിയ കണക്ഷൻ, ചോർച്ച റിപ്പോർട്ട്' },
            pa: { title: 'ਗੈਸ ਬੁਕਿੰਗ', description: 'ਰਿਫਿਲ ਬੁਕਿੰਗ, ਨਵਾਂ ਕਨੈਕਸ਼ਨ, ਲੀਕੇਜ ਰਿਪੋਰਟ' }
        }
    },
    {
        id: 'waste',
        icon: 'trash-2',
        color: 'bg-green-500',
        subServices: [
            { id: 'collection', icon: 'delete', color: 'bg-green-500', actionLabelKey: 'request_now', translations: { en: { title: 'Waste Collection', description: 'Schedule a waste collection pickup' }, hi: { title: 'कचरा संग्रह', description: 'कचरा संग्रह पिकअप शेड्यूल करें' }, bn: { title: 'বর্জ্য সংগ্রহ', description: 'বর্জ্য সংগ্রহ পিকআপ নির্ধারণ করুন' }, te: { title: 'వ్యర్థ సేకరణ', description: 'వ్యర్థ సేకరణ పికప్ షెడ్యూల్ చేయండి' }, mr: { title: 'कचरा संकलन', description: 'कचरा संकलन पिकअप शेड्यूल करा' }, ta: { title: 'கழிவு சேகரிப்பு', description: 'கழிவு சேகரிப்பு பிக்அப் அட்டவணைப்படுத்துங்கள்' }, gu: { title: 'કચરો સંગ્રહ', description: 'કચરો સંગ્રહ પિકઅપ શેડ્યૂલ કરો' }, kn: { title: 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ', description: 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹ ಪಿಕಪ್ ಶೆಡ್ಯೂಲ್ ಮಾಡಿ' }, ml: { title: 'മാലിന്യ ശേഖരണം', description: 'മാലിന്യ ശേഖരണ പിക്കപ്പ് ഷെഡ്യൂൾ ചെയ്യുക' }, pa: { title: 'ਕੂੜਾ ਸੰਗ੍ਰਹਿ', description: 'ਕੂੜਾ ਸੰਗ੍ਰਹਿ ਪਿੱਕਅੱਪ ਸ਼ੈਡਿਊਲ ਕਰੋ' } } },
            { id: 'bulk-pickup', icon: 'local_shipping', color: 'bg-orange-500', actionLabelKey: 'book_now', translations: { en: { title: 'Bulk Waste Pickup', description: 'Book a bulk waste pickup for large items' }, hi: { title: 'बड़ा कचरा पिकअप', description: 'बड़ी वस्तुओं के लिए बल्क पिकअप बुक करें' }, bn: { title: 'বাল্ক বর্জ্য পিকআপ', description: 'বড় আইটেমের জন্য বাল্ক পিকআপ বুক করুন' }, te: { title: 'బల్క్ వేస్ట్ పికప్', description: 'పెద్ద వస్తువుల కోసం బల్క్ పికప్ బుక్ చేయండి' }, mr: { title: 'मोठा कचरा पिकअप', description: 'मोठ्या वस्तूंसाठी बल्क पिकअप बुक करा' }, ta: { title: 'பெருங்கழிவு பிக்அப்', description: 'பெரிய பொருட்களுக்கு பெருங்கழிவு பிக்அப் புக் செய்யுங்கள்' }, gu: { title: 'બલ્ક વેસ્ટ પિકઅપ', description: 'મોટી વસ્તુઓ માટે બલ્ક પિકઅપ બુક કરો' }, kn: { title: 'ಬೃಹತ್ ತ್ಯಾಜ್ಯ ಪಿಕಪ್', description: 'ದೊಡ್ಡ ವಸ್ತುಗಳಿಗೆ ಬೃಹತ್ ಪಿಕಪ್ ಬುಕ್ ಮಾಡಿ' }, ml: { title: 'ബൾക്ക് വേസ്റ്റ് പിക്കപ്പ്', description: 'വലിയ വസ്തുക്കൾക്ക് ബൾക്ക് പിക്കപ്പ് ബുക്ക് ചെയ്യുക' }, pa: { title: 'ਬਲਕ ਕੂੜਾ ਪਿੱਕਅੱਪ', description: 'ਵੱਡੀਆਂ ਵਸਤਾਂ ਲਈ ਬਲਕ ਪਿੱਕਅੱਪ ਬੁੱਕ ਕਰੋ' } } },
            { id: 'new-dustbin', icon: 'recycling', color: 'bg-blue-500', actionLabelKey: 'apply_now', translations: { en: { title: 'New Dustbin Request', description: 'Request a new dustbin for your area' }, hi: { title: 'नया डस्टबिन अनुरोध', description: 'अपने क्षेत्र के लिए नया डस्टबिन मांगें' }, bn: { title: 'নতুন ডাস্টবিন অনুরোধ', description: 'আপনার এলাকায় নতুন ডাস্টবিন চান' }, te: { title: 'కొత్త డస్ట్‌బిన్ అభ్యర్థన', description: 'మీ ప్రాంతానికి కొత్త డస్ట్‌బిన్ కోరండి' }, mr: { title: 'नवीन कचरा पेटी विनंती', description: 'तुमच्या परिसरासाठी नवीन कचरापेटी मागा' }, ta: { title: 'புதிய குப்பைத்தொட்டி கோரிக்கை', description: 'உங்கள் பகுதிக்கு புதிய குப்பைத்தொட்டி கோருங்கள்' }, gu: { title: 'નવું ડસ્ટબિન વિનંતી', description: 'તમારા વિસ્તાર માટે નવું ડસ્ટબિન માંગો' }, kn: { title: 'ಹೊಸ ಡಸ್ಟ್‌ಬಿನ್ ವಿನಂತಿ', description: 'ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಹೊಸ ಡಸ್ಟ್‌ಬಿನ್ ಕೋರಿ' }, ml: { title: 'പുതിയ ഡസ്റ്റ്ബിൻ അഭ്യർത്ഥന', description: 'നിങ്ങളുടെ പ്രദേശത്തേക്ക് പുതിയ ഡസ്റ്റ്ബിൻ അഭ്യർത്ഥിക്കുക' }, pa: { title: 'ਨਵਾਂ ਡਸਟਬਿਨ ਬੇਨਤੀ', description: 'ਆਪਣੇ ਖੇਤਰ ਲਈ ਨਵਾਂ ਡਸਟਬਿਨ ਮੰਗੋ' } } },
        ],
        translations: {
            en: { title: 'Waste management', description: 'Collection request, complaint, special cleaning' },
            hi: { title: 'कचरा प्रबंधन', description: 'संग्रह अनुरोध, शिकायत, विशेष सफाई' },
            bn: { title: 'বর্জ্য ব্যবস্থাপনা', description: 'সংগ্রহের অনুরোধ, অভিযোগ, বিশেষ পরিচ্ছন্নতা' },
            te: { title: 'వ్యర్థాల నిర్వహణ', description: 'సేకరణ అభ్యర్థన, ఫిర్యాదు, ప్రత్యేక శుభ్రత' },
            mr: { title: 'कचरा व्यवस्थापन', description: 'संकलन विनंती, तक्रार, विशेष स्वच्छता' },
            ta: { title: 'கழிவு மேலாண்மை', description: 'சேகரிப்பு கோரிக்கை, புகார், சிறப்பு சுத்தம்' },
            gu: { title: 'કચરો વ્યવસ્થાપન', description: 'સંગ્રહ વિનંતી, ફરિયાદ, વિશેષ સફાઈ' },
            kn: { title: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ', description: 'ಸಂಗ್ರಹಣೆ ವಿನಂತಿ, ದೂರು, ವಿಶೇಷ ಶುಚಿಗೊಳಿಸುವಿಕೆ' },
            ml: { title: 'മാലിന്യ സംസ്കരണം', description: 'ശേഖരണ അഭ്യർത്ഥന, പരാതി, പ്രത്യേക ശുചീകരണം' },
            pa: { title: 'ਕੂੜਾ ਪ੍ਰਬੰਧਨ', description: 'ਸੰਗ੍ਰਹਿ ਦੀ ਬੇਨਤੀ, ਸ਼ਿਕਾਇਤ, ਵਿਸ਼ੇਸ਼ ਸਫਾਈ' }
        }
    },
    {
        id: 'health',
        icon: 'heart-pulse',
        color: 'bg-red-500',
        subServices: [
            { id: 'opd-registration', icon: 'medical_services', color: 'bg-red-500', actionLabelKey: 'apply_now', translations: { en: { title: 'OPD Registration', description: 'Register for outpatient department visit' }, hi: { title: 'ओपीडी पंजीकरण', description: 'बाह्य रोगी विभाग में पंजीकरण करें' }, bn: { title: 'ওপিডি রেজিস্ট্রেশন', description: 'বহির্বিভাগে রেজিস্ট্রেশন করুন' }, te: { title: 'OPD రిజిస్ట్రేషన్', description: 'OP విభాగ సందర్శనకు నమోదు చేయండి' }, mr: { title: 'ओपीडी नोंदणी', description: 'बाह्यरुग्ण विभागात नोंदणी करा' }, ta: { title: 'OPD பதிவு', description: 'வெளிநோயாளர் பிரிவு பதிவு செய்யுங்கள்' }, gu: { title: 'OPD નોંધણી', description: 'બહારના દર્દી વિભાગમાં નોંધણી કરો' }, kn: { title: 'OPD ನೋಂದಣಿ', description: 'ಹೊರರೋಗಿ ವಿಭಾಗಕ್ಕೆ ನೋಂದಣಿ ಮಾಡಿ' }, ml: { title: 'OPD രജിസ്ട്രേഷൻ', description: 'OP വിഭാഗ സന്ദർശനത്തിനു രജിസ്റ്റർ ചെയ്യുക' }, pa: { title: 'ਓਪੀਡੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਬਾਹਰੀ ਮਰੀਜ਼ ਵਿਭਾਗ ਵਿੱਚ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਰੋ' } } },
            { id: 'lab-reports', icon: 'science', color: 'bg-purple-500', actionLabelKey: 'request_now', translations: { en: { title: 'Lab Reports', description: 'View and download your lab reports' }, hi: { title: 'लैब रिपोर्ट', description: 'अपनी लैब रिपोर्ट देखें और डाउनलोड करें' }, bn: { title: 'ল্যাব রিপোর্ট', description: 'আপনার ল্যাব রিপোর্ট দেখুন ও ডাউনলোড করুন' }, te: { title: 'ల్యాబ్ రిపోర్ట్‌లు', description: 'మీ ల్యాబ్ రిపోర్ట్‌లను చూడండి మరియు డౌన్‌లోడ్ చేయండి' }, mr: { title: 'लॅब रिपोर्ट्स', description: 'तुमचे लॅब रिपोर्ट्स पहा आणि डाउनलोड करा' }, ta: { title: 'ஆய்வக அறிக்கைகள்', description: 'உங்கள் ஆய்வக அறிக்கைகளைப் பார்த்து பதிவிறக்கவும்' }, gu: { title: 'લેબ રિપોર્ટ્સ', description: 'તમારા લેબ રિપોર્ટ્સ જુઓ અને ડાઉનલોડ કરો' }, kn: { title: 'ಲ್ಯಾಬ್ ವರದಿಗಳು', description: 'ನಿಮ್ಮ ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' }, ml: { title: 'ലാബ് റിപ്പോർട്ടുകൾ', description: 'നിങ്ങളുടെ ലാബ് റിപ്പോർട്ടുകൾ കാണുകയും ഡൗൺലോഡ് ചെയ്യുകയും ചെയ്യുക' }, pa: { title: 'ਲੈਬ ਰਿਪੋਰਟਾਂ', description: 'ਆਪਣੀਆਂ ਲੈਬ ਰਿਪੋਰਟਾਂ ਦੇਖੋ ਅਤੇ ਡਾਊਨਲੋਡ ਕਰੋ' } } },
            { id: 'doctor-availability', icon: 'event_available', color: 'bg-teal-500', actionLabelKey: 'request_now', translations: { en: { title: 'Doctor Availability', description: 'Check doctor schedules and book appointments' }, hi: { title: 'डॉक्टर की उपलब्धता', description: 'डॉक्टर की अनुसूची देखें और अपॉइंटमेंट बुक करें' }, bn: { title: 'ডাক্তারের প্রাপ্যতা', description: 'ডাক্তারের সিডিউল দেখুন ও অ্যাপয়েন্টমেন্ট বুক করুন' }, te: { title: 'డాక్టర్ లభ్యత', description: 'డాక్టర్ షెడ్యూల్ చూసి అపాయింట్‌మెంట్ బుక్ చేయండి' }, mr: { title: 'डॉक्टरांची उपलब्धता', description: 'डॉक्टरांचे वेळापत्रक तपासा व अपॉइंटमेंट बुक करा' }, ta: { title: 'மருத்துவர் கிடைக்கும் தன்மை', description: 'மருத்துவர் அட்டவணையைப் பாருங்கள், சந்திப்பு முன்பதிவு செய்யுங்கள்' }, gu: { title: 'ડોક્ટરની ઉપલબ્ધતા', description: 'ડોક્ટરનું શેડ્યૂલ ચકાસો અને એપોઇન્ટમેન્ટ બુક કરો' }, kn: { title: 'ವೈದ್ಯರ ಲಭ್ಯತೆ', description: 'ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ' }, ml: { title: 'ഡോക്ടറുടെ ലഭ്യത', description: 'ഡോക്ടറുടെ ഷെഡ്യൂൾ ചെക്ക് ചെയ്ത് അപ്പോയ്ന്റ്മെന്റ് ബുക്ക് ചെയ്യുക' }, pa: { title: 'ਡਾਕਟਰ ਦੀ ਉਪਲਬਧਤਾ', description: 'ਡਾਕਟਰ ਦਾ ਸ਼ੈਡਿਊਲ ਦੇਖੋ ਅਤੇ ਅਪੌਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ' } } },
        ],
        translations: {
            en: { title: 'e-Sushrut Health', description: 'OPD registration, lab reports, doctor availability' },
            hi: { title: 'ई-सुश्रुत स्वास्थ्य', description: 'ओपीडी पंजीकरण, लैब रिपोर्ट, डॉक्टर की उपलब्धता' },
            bn: { title: 'ই-সুশ্রুত স্বাস্থ্য', description: 'ওপিডি রেজিস্ট্রেশন, ল্যাব রিপোর্ট, ডাক্তারের প্রাপ্যতা' },
            te: { title: 'ఇ-సుశ్రుత్ ఆరోగ్యం', description: 'OPD రిజిస్ట్రేషన్, ల్యాబ్ రిపోర్ట్‌లు, డాక్టర్ లభ్యత' },
            mr: { title: 'ई-सुश्रुत आरोग्य', description: 'ओपीडी नोंदणी, लॅब रिपोर्ट्स, डॉक्टरांची उपलब्धता' },
            ta: { title: 'இ-சுஷ்ருத் ஆரோக்கியம்', description: 'OPD பதிவு, ஆய்வக அறிக்கைகள், மருத்துவர் கிடைக்கும் தன்மை' },
            gu: { title: 'ઇ-સુશ્રુત આરોગ્ય', description: 'OPD નોંધણી, લેબ રિપોર્ટ્સ, ડોક્ટરની ઉપલબ્ધતા' },
            kn: { title: 'ಇ-ಸುಶ್ರುತ್ ಆರೋಗ್ಯ', description: 'OPD ನೋಂದಣಿ, ಲ್ಯಾಬ್ ವರದಿಗಳು, ವೈದ್ಯರ ಲಭ್ಯತೆ' },
            ml: { title: 'ഇ-സുശ്രുത് ആരോഗ്യം', description: 'OPD രജിസ്ട്രേഷൻ, ലാബ് റിപ്പോർട്ടുകൾ, ഡോക്ടറുടെ ലഭ്യത' },
            pa: { title: 'ਈ-ਸੁਸ਼ਰੁਤ ਸਿਹਤ', description: 'ਓਪੀਡੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਲੈਬ ਰਿਪੋਰਟਾਂ, ਡਾਕਟਰ ਦੀ ਉਪਲਬਧਤਾ' }
        }
    },
    {
        id: 'certificates',
        icon: 'file-text',
        color: 'bg-indigo-600',
        subServices: [
            { id: 'birth-certificate', icon: 'child_care', color: 'bg-indigo-500', actionLabelKey: 'apply_now', translations: { en: { title: 'Birth Certificate', description: 'Apply for a birth certificate' }, hi: { title: 'जन्म प्रमाण पत्र', description: 'जन्म प्रमाण पत्र के लिए आवेदन करें' }, bn: { title: 'জন্ম সনদ', description: 'জন্ম সনদের জন্য আবেদন করুন' }, te: { title: 'జనన ధృవీకరణ పత్రం', description: 'జనన ధృవీకరణ పత్రం కోసం దరఖాస్తు చేయండి' }, mr: { title: 'जन्म प्रमाणपत्र', description: 'जन्म प्रमाणपत्रासाठी अर्ज करा' }, ta: { title: 'பிறப்புச் சான்றிதழ்', description: 'பிறப்புச் சான்றிதழுக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'જન્મ પ્રમાણપત્ર', description: 'જન્મ પ્રમાણપત્ર માટે અરજી કરો' }, kn: { title: 'ಜನನ ಪ್ರಮಾಣಪತ್ರ', description: 'ಜನನ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'ജനന സർട്ടിഫിക്കറ്റ്', description: 'ജനന സർട്ടിഫിക്കറ്റിനു അപേക്ഷിക്കുക' }, pa: { title: 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ', description: 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
            { id: 'death-certificate', icon: 'description', color: 'bg-gray-600', actionLabelKey: 'apply_now', translations: { en: { title: 'Death Certificate', description: 'Apply for a death certificate' }, hi: { title: 'मृत्यु प्रमाण पत्र', description: 'मृत्यु प्रमाण पत्र के लिए आवेदन करें' }, bn: { title: 'মৃত্যু সনদ', description: 'মৃত্যু সনদের জন্য আবেদন করুন' }, te: { title: 'మరణ ధృవీకరణ పత్రం', description: 'మరణ ధృవీకరణ పత్రం కోసం దరఖాస్తు చేయండి' }, mr: { title: 'मृत्यू प्रमाणपत्र', description: 'मृत्यू प्रमाणपत्रासाठी अर्ज करा' }, ta: { title: 'இறப்புச் சான்றிதழ்', description: 'இறப்புச் சான்றிதழுக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'મૃત્યુ પ્રમાણપત્ર', description: 'મૃત્યુ પ્રમાણપત્ર માટે અરજી કરો' }, kn: { title: 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ', description: 'ಮರಣ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'മരണ സർട്ടിഫിക്കറ്റ്', description: 'മരണ സർട്ടിഫിക്കറ്റിനു അപേക്ഷിക്കുക' }, pa: { title: 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ', description: 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
            { id: 'income-certificate', icon: 'account_balance', color: 'bg-emerald-600', actionLabelKey: 'apply_now', translations: { en: { title: 'Income Certificate', description: 'Apply for an income certificate' }, hi: { title: 'आय प्रमाण पत्र', description: 'आय प्रमाण पत्र के लिए आवेदन करें' }, bn: { title: 'আয় সনদ', description: 'আয় সনদের জন্য আবেদন করুন' }, te: { title: 'ఆదాయ ధృవీకరణ పత్రం', description: 'ఆదాయ ధృవీకరణ పత్రం కోసం దరఖాస్తు చేయండి' }, mr: { title: 'उत्पन्न प्रमाणपत्र', description: 'उत्पन्न प्रमाणपत्रासाठी अर्ज करा' }, ta: { title: 'வருமானச் சான்றிதழ்', description: 'வருமானச் சான்றிதழுக்கு விண்ணப்பிக்கவும்' }, gu: { title: 'આવક પ્રમાણપત્ર', description: 'આવક પ્રમાણપત્ર માટે અરજી કરો' }, kn: { title: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', description: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' }, ml: { title: 'വരുമാന സർട്ടിഫിക്കറ്റ്', description: 'വരുമാന സർട്ടിഫിക്കറ്റിനു അപേക്ഷിക്കുക' }, pa: { title: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ', description: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' } } },
        ],
        translations: {
            en: { title: 'e-Pramaan Services', description: 'Birth, death, and income certificate applications' },
            hi: { title: 'ई-प्रमाण सेवाएं', description: 'जन्म, मृत्यु और आय प्रमाण पत्र आवेदन' },
            bn: { title: 'ই-প্রমাণ পরিষেবা', description: 'জন্ম, মৃত্যু এবং আয় শংসাপত্রের আবেদন' },
            te: { title: 'ఇ-ప్రమాణ్ సేవలు', description: 'జనన, మరణ మరియు ఆదాయ ధృవీకరణ పత్ర దరఖాస్తులు' },
            mr: { title: 'ई-प्रमाण सेवा', description: 'जन्म, मृत्यू आणि उत्पन्न प्रमाणपत्रासाठी अर्ज' },
            ta: { title: 'இ-பிரமான் சேவைகள்', description: 'பிறப்பு, இறப்பு மற்றும் வருமானச் சான்றிதழ் விண்ணப்பங்கள்' },
            gu: { title: 'ઇ-પ્રમાણ સેવાઓ', description: 'જન્મ, મૃત્યુ અને આવકના પ્રમાણપત્રની અરજીઓ' },
            kn: { title: 'ಇ-ಪ್ರಮಾಣ್ ಸೇವೆಗಳು', description: 'ಜನನ, ಮರಣ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಅರ್ಜಿಗಳು' },
            ml: { title: 'ഇ-പ്രമാൺ സേവനങ്ങൾ', description: 'ജനന, മരണ, വരുമാന സർട്ടിഫിക്കറ്റ് അപേക്ഷകൾ' },
            pa: { title: 'ਈ-ਪ੍ਰਮਾਣ ਸੇਵਾਵਾਂ', description: 'ਜਨਮ, ਮੌਤ ਅਤੇ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਅਰਜ਼ੀਆਂ' }
        }
    }
];
