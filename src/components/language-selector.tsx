import { useEffect, useState } from "react";

const STORAGE_KEY = "exam-alert-language";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "ml", label: "മലയാളം" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function LanguageSelector({ dark = false }: { dark?: boolean }) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (LANGUAGES.some((item) => item.code === saved)) {
      setLanguage(saved as LanguageCode);
    }
  }, []);

  const changeLanguage = (value: LanguageCode) => {
    setLanguage(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    document.documentElement.lang = value === "en" ? "en-IN" : value;
    document.documentElement.dataset.language = value;
  };

  return (
    <label
      className={`inline-flex items-center gap-2 text-xs font-semibold ${dark ? "text-white" : ""}`}
    >
      <span className="sr-only">Language</span>
      <span aria-hidden="true">Language</span>
      <select
        aria-label="Language"
        value={language}
        onChange={(event) => changeLanguage(event.target.value as LanguageCode)}
        className={`rounded-md border px-2 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary ${
          dark
            ? "border-white/20 bg-white/10 text-white"
            : "border-input bg-background text-foreground"
        }`}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} className="bg-background text-foreground">
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
