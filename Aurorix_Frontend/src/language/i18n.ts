"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import th from "./th.json";

// Get saved language from localStorage (from aurorix-theme store)
const getSavedLanguage = (): string => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("aurorix-theme");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.state?.language &&
          (parsed.state.language === "en" || parsed.state.language === "th")
        ) {
          return parsed.state.language;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: getSavedLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Remove old aurorix-language key if it exists (cleanup)
if (typeof window !== "undefined") {
  localStorage.removeItem("aurorix-language");
}

export default i18n;
