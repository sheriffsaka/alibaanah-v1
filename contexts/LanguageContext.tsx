
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLocales = ['en', 'ar', 'fr', 'ur', 'zh', 'uz'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
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

  useEffect(() => {
    const fetchTranslations = async () => {
      const translationsData: Record<string, any> = {};
      await Promise.all(
        availableLocales.map(async (lang) => {
          try {
            // Fetch paths are relative to the index.html file in the browser
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            translationsData[lang] = data;
          } catch (e) {
            console.error(`Could not load locale file: ./locales/${lang}.json`, e);
          }
        })
      );
      setTranslations(translationsData);
    };

    fetchTranslations();
  }, []);

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
    if (!translations) {
      return key; // Return key as fallback while translations are loading
    }
    return translations[locale]?.[key] || key;
  }, [locale, translations]);

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
