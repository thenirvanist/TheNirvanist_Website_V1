import { LanguageCode } from "@/contexts/LanguageContext";
import en from "./en.json";
import fr from "./fr.json";

// Import placeholder files for other languages (these contain English text as fallbacks)
// You can replace these with actual translations when ready
const de = en; // German - replace with actual German translations
const es = en; // Spanish - replace with actual Spanish translations
const zh = en; // Chinese - replace with actual Chinese translations
const ar = en; // Arabic - replace with actual Arabic translations
const ru = en; // Russian - replace with actual Russian translations  
const pt = en; // Portuguese - replace with actual Portuguese translations

/**
 * Static translations object containing all manual translations
 * This is used for UI elements, navigation, forms, and other static content
 */
export const translations = {
  en,
  fr,
  de,
  es,
  zh,
  ar,
  ru,
  pt,
} as const;

/**
 * Type for translation keys - allows TypeScript autocomplete for translation paths
 */
export type TranslationKey = keyof typeof en;

/**
 * Deeply nested translation key paths for dot notation access
 */
export type DeepTranslationKey = 
  | "navigation.home"
  | "navigation.journeys"
  | "navigation.meetups"
  | "navigation.innerNutrition"
  | "navigation.sages"
  | "navigation.ashrams"
  | "navigation.login"
  | "navigation.signUp"
  | "navigation.logout"
  | "navigation.myCollection"
  | "navigation.welcome"
  | "hero.title"
  | "hero.subtitle"
  | "hero.cta"
  | "hero.secondaryCta"
  | "about.title"
  | "about.description"
  | "contact.title"
  | "contact.name"
  | "contact.email"
  | "contact.subject"
  | "contact.message"
  | "contact.send"
  | "contact.success"
  | "auth.login"
  | "auth.register"
  | "auth.forgotPassword"
  | "auth.resetPassword"
  | "auth.firstName"
  | "auth.lastName"
  | "auth.email"
  | "auth.password"
  | "auth.confirmPassword"
  | "auth.loginButton"
  | "auth.registerButton"
  | "auth.forgotPasswordButton"
  | "auth.resetPasswordButton"
  | "auth.alreadyHaveAccount"
  | "auth.dontHaveAccount"
  | "auth.backToLogin"
  | "dashboard.title"
  | "dashboard.noBookmarks"
  | "dashboard.journeys"
  | "dashboard.sages"
  | "dashboard.ashrams"
  | "dashboard.articles"
  | "common.loading"
  | "common.readMore"
  | "common.learnMore"
  | "common.viewDetails"
  | "common.bookNow"
  | "common.register"
  | "common.search"
  | "common.filter"
  | "common.all"
  | "common.featured"
  | "common.popular"
  | "common.recent"
  | "common.save"
  | "common.cancel"
  | "common.close"
  | "footer.aboutUs"
  | "footer.contact"
  | "footer.privacy"
  | "footer.terms"
  | "footer.newsletter"
  | "footer.subscribeNewsletter"
  | "footer.subscribe"
  | "footer.copyright";

/**
 * Utility function to get nested translation value using dot notation
 * @param obj - Translation object
 * @param path - Dot-separated path like "navigation.home"
 * @returns Translation value or fallback
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

/**
 * Get translation for a specific language and key
 * @param language - Language code
 * @param key - Translation key or dot-separated path
 * @param fallback - Fallback text if translation not found
 * @returns Translated text
 */
export function getTranslation(
  language: LanguageCode,
  key: DeepTranslationKey,
  fallback?: string
): string {
  const languageTranslations = translations[language];
  const translation = getNestedValue(languageTranslations, key);
  
  // If translation not found, try English as fallback
  if (translation === key && language !== 'en') {
    const englishTranslation = getNestedValue(translations.en, key);
    return englishTranslation !== key ? englishTranslation : (fallback || key);
  }
  
  return translation || fallback || key;
}