
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Statically import translations to ensure they are bundled by Vite
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import frTranslations from '../locales/fr.json';
import urTranslations from '../locales/ur.json';
import zhTranslations from '../locales/zh.json';
import uzTranslations from '../locales/uz.json';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLocales = ['en', 'ar', 'fr', 'ur', 'zh', 'uz'];
const translations = {
  en: enTranslations,
  ar: arTranslations,
  fr: frTranslations,
  ur: urTranslations,
  zh: zhTranslations,
  uz: uzTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(() => {
    // 1. Check for a user's previously saved preference
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && availableLocales.includes(savedLocale)) {
      return savedLocale;
    }

    // 2. Auto-detect from browser language
    const browserLang = navigator.language.split('-')[0]; // 'en-US' -> 'en'
    if (availableLocales.includes(browserLang)) {
      return browserLang;
    }

    // 3. Fallback to English
    return 'en';
  });

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    const isRtl = locale === 'ar' || locale === 'ur';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => (key: string): string => {
    const typedLocale = locale as keyof typeof translations;
    return translations[typedLocale]?.[key] || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};