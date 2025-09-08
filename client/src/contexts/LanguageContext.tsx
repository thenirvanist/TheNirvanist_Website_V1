import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Supported languages with their display names and codes
export const SUPPORTED_LANGUAGES = {
  en: { name: "English", code: "en", flag: "🇺🇸" },
  fr: { name: "Français", code: "fr", flag: "🇫🇷" },
  de: { name: "Deutsch", code: "de", flag: "🇩🇪" },
  es: { name: "Español", code: "es", flag: "🇪🇸" },
  zh: { name: "中文", code: "zh", flag: "🇨🇳" },
  ar: { name: "العربية", code: "ar", flag: "🇸🇦" },
  ru: { name: "Русский", code: "ru", flag: "🇷🇺" },
  pt: { name: "Português", code: "pt", flag: "🇵🇹" },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  isTranslating: boolean;
  setIsTranslating: (translating: boolean) => void;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * LanguageProvider - Manages the global language state for the application
 * 
 * Features:
 * - Persists selected language to localStorage
 * - Provides translation state management
 * - Supports 8 languages: English (default), French, German, Spanish, Chinese, Arabic, Russian, Portuguese
 * - Includes language flags and native names for display
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("nirvanist-language") as LanguageCode;
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem("nirvanist-language", language);
    
    // Show loading state briefly when changing languages
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 500);
  };

  const value = {
    currentLanguage,
    setLanguage,
    isTranslating,
    setIsTranslating,
    availableLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLanguage - Hook to access language context
 * 
 * @returns LanguageContextType with current language, setter, and translation state
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}