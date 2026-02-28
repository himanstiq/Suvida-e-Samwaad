export type Screen = 'welcome' | 'login' | 'dashboard' | 'service_detail' | 'status' | 'success' | 'creative' | 'waste_dashboard';

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

export interface Service {
  id: string;
  icon: string;
  color: string;
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
    translations: {
      en: { title: 'e-Sushrut Health', description: 'OPD registration, lab reports, doctor availability' },
      hi: { title: 'ई-सुश्रुत स्वास्थ्य', description: 'ओपीडी पंजीकरण, लैब रिपोर्ट, डॉक्टर की उपलब्धता' },
      bn: { title: 'ই-সুশ্রুত স্বাস্থ্য', description: 'ওপিডি রেজিস্ট্রেশন, ল্যাব রিপোর্ট, ডাক্তারের প্রাপ্যতা' },
      te: { title: 'ఇ-సుశ్రుత్ ఆరోగ్యం', description: 'OPD రిజిస్ట్రేషన్, ల్యాబ్ రిపోర్ట్‌లు, డాక్టర్ లభ్యత' },
      mr: { title: 'ई-सुश्रुत आरोग्य', description: 'ओपीडी नोंदણી, लॅब रिपोर्ट्स, डॉक्टरांची उपलब्धता' },
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
