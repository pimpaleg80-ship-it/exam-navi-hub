import { useEffect, useState } from "react";

export const LANGUAGE_KEY = "exam-alert-language";
export type LanguageCode = "en" | "mr" | "hi" | "te" | "ta" | "bn" | "ml";
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "ml", label: "മലയാളം" },
] as const;

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  mr: {
    "Centralized exam intelligence · India": "केंद्रीकृत परीक्षा माहिती · भारत",
    "Never miss an": "एकही परीक्षा चुकवू नका",
    "exam update": "परीक्षा अपडेट",
    "Browse exams": "परीक्षा पहा",
    "Government & civil services": "सरकारी व नागरी सेवा",
    "Live exam radar": "लाइव्ह परीक्षा रडार",
    "Updated today": "आज अपडेट केले",
    "Search exam, body or code": "परीक्षा, संस्था किंवा कोड शोधा",
    "Exams tracked": "ट्रॅक केलेल्या परीक्षा",
    "Registration open": "नोंदणी सुरू",
    "Closing in 48 hrs": "४८ तासांत बंद",
    "All streams": "सर्व शाखा",
    "All categories": "सर्व श्रेणी",
    "Exam calendar": "परीक्षा कॅलेंडर",
    "My alerts": "माझे अलर्ट",
    "What needs attention next": "पुढे कशाकडे लक्ष द्यावे",
    "Plan beyond one exam": "एका परीक्षेपलीकडे योजना करा",
  },
  hi: {
    "Centralized exam intelligence · India": "केंद्रीकृत परीक्षा जानकारी · भारत",
    "Never miss an": "एक भी परीक्षा न चूकें",
    "exam update": "परीक्षा अपडेट",
    "Browse exams": "परीक्षाएं देखें",
    "Government & civil services": "सरकारी और सिविल सेवाएं",
    "Live exam radar": "लाइव परीक्षा रडार",
    "Updated today": "आज अपडेट किया गया",
    "Search exam, body or code": "परीक्षा, संस्था या कोड खोजें",
    "Exams tracked": "ट्रैक की गई परीक्षाएं",
    "Registration open": "पंजीकरण शुरू",
    "Closing in 48 hrs": "४८ घंटे में बंद",
    "All streams": "सभी स्ट्रीम",
    "All categories": "सभी श्रेणियां",
    "Exam calendar": "परीक्षा कैलेंडर",
    "My alerts": "मेरे अलर्ट",
    "What needs attention next": "अगला महत्वपूर्ण काम",
    "Plan beyond one exam": "एक परीक्षा से आगे की योजना",
  },
  te: {
    "Centralized exam intelligence · India": "కేంద్రీకృత పరీక్ష సమాచారం · భారతదేశం",
    "Never miss an": "ఏ పరీక్షను మిస్ కాకండి",
    "exam update": "పరీక్ష అప్‌డేట్",
    "Browse exams": "పరీక్షలను చూడండి",
    "Government & civil services": "ప్రభుత్వ మరియు సివిల్ సేవలు",
    "Live exam radar": "లైవ్ పరీక్ష రాడార్",
    "Updated today": "ఈరోజు అప్‌డేట్",
    "Search exam, body or code": "పరీక్ష, సంస్థ లేదా కోడ్ వెతకండి",
    "Exams tracked": "ట్రాక్ చేసిన పరీక్షలు",
    "Registration open": "రిజిస్ట్రేషన్ ప్రారంభం",
    "All streams": "అన్ని స్ట్రీమ్‌లు",
    "All categories": "అన్ని కేటగిరీలు",
    "Exam calendar": "పరీక్ష క్యాలెండర్",
    "My alerts": "నా అలర్ట్‌లు",
    "What needs attention next": "తర్వాత ఏమి గమనించాలి",
    "Plan beyond one exam": "ఒక పరీక్షకు మించిన ప్రణాళిక",
  },
  ta: {
    "Centralized exam intelligence · India": "மையப்படுத்தப்பட்ட தேர்வு தகவல் · இந்தியா",
    "Never miss an": "எந்த தேர்வையும் தவறவிடாதீர்கள்",
    "exam update": "தேர்வு புதுப்பிப்பு",
    "Browse exams": "தேர்வுகளைப் பார்க்கவும்",
    "Government & civil services": "அரசு மற்றும் குடிமைப் பணிகள்",
    "Live exam radar": "நேரடி தேர்வு ரேடார்",
    "Updated today": "இன்று புதுப்பிக்கப்பட்டது",
    "Search exam, body or code": "தேர்வு, நிறுவனம் அல்லது குறியீட்டைத் தேடுங்கள்",
    "Exams tracked": "கண்காணிக்கப்படும் தேர்வுகள்",
    "Registration open": "பதிவு தொடங்கியது",
    "All streams": "அனைத்து பிரிவுகள்",
    "All categories": "அனைத்து வகைகள்",
    "Exam calendar": "தேர்வு நாட்காட்டி",
    "My alerts": "எனது அலர்ட்கள்",
    "What needs attention next": "அடுத்து கவனிக்க வேண்டியது",
    "Plan beyond one exam": "ஒரு தேர்வைத் தாண்டிய திட்டம்",
  },
  bn: {
    "Centralized exam intelligence · India": "কেন্দ্রীভূত পরীক্ষা তথ্য · ভারত",
    "Never miss an": "কোনও পরীক্ষা মিস করবেন না",
    "exam update": "পরীক্ষার আপডেট",
    "Browse exams": "পরীক্ষা দেখুন",
    "Government & civil services": "সরকারি ও সিভিল সার্ভিস",
    "Live exam radar": "লাইভ পরীক্ষা রাডার",
    "Updated today": "আজ আপডেট হয়েছে",
    "Search exam, body or code": "পরীক্ষা, সংস্থা বা কোড খুঁজুন",
    "Exams tracked": "ট্র্যাক করা পরীক্ষা",
    "Registration open": "রেজিস্ট্রেশন শুরু",
    "All streams": "সব স্ট্রিম",
    "All categories": "সব বিভাগ",
    "Exam calendar": "পরীক্ষার ক্যালেন্ডার",
    "My alerts": "আমার অ্যালার্ট",
    "What needs attention next": "পরবর্তী গুরুত্বপূর্ণ বিষয়",
    "Plan beyond one exam": "একটি পরীক্ষার বাইরেও পরিকল্পনা করুন",
  },
  ml: {
    "Centralized exam intelligence · India": "കേന്ദ്രീകൃത പരീക്ഷാ വിവരങ്ങൾ · ഇന്ത്യ",
    "Never miss an": "ഒരു പരീക്ഷയും നഷ്ടപ്പെടുത്തരുത്",
    "exam update": "പരീക്ഷാ അപ്ഡേറ്റ്",
    "Browse exams": "പരീക്ഷകൾ കാണുക",
    "Government & civil services": "സർക്കാർ, സിവിൽ സർവീസുകൾ",
    "Live exam radar": "ലൈവ് പരീക്ഷാ റഡാർ",
    "Updated today": "ഇന്ന് അപ്ഡേറ്റ് ചെയ്തു",
    "Search exam, body or code": "പരീക്ഷ, സ്ഥാപനം അല്ലെങ്കിൽ കോഡ് തിരയുക",
    "Exams tracked": "ട്രാക്ക് ചെയ്ത പരീക്ഷകൾ",
    "Registration open": "രജിസ്ട്രേഷൻ ആരംഭിച്ചു",
    "All streams": "എല്ലാ സ്ട്രീമുകളും",
    "All categories": "എല്ലാ വിഭാഗങ്ങളും",
    "Exam calendar": "പരീക്ഷാ കലണ്ടർ",
    "My alerts": "എന്റെ അലർട്ടുകൾ",
    "What needs attention next": "അടുത്തതായി ശ്രദ്ധിക്കേണ്ടത്",
    "Plan beyond one exam": "ഒരു പരീക്ഷയ്ക്കപ്പുറം ആസൂത്രണം ചെയ്യുക",
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
    if (saved && saved in translations) setLanguage(saved);
    const onChange = (event: Event) => setLanguage((event as CustomEvent<LanguageCode>).detail);
    window.addEventListener("exam-alert-language-change", onChange);
    return () => window.removeEventListener("exam-alert-language-change", onChange);
  }, []);
  return { language, t: (key: string) => translations[language][key] ?? key };
}
