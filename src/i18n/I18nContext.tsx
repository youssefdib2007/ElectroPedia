import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from '../types/electronics';
import { applyLocaleToDocument, getStoredLocale, saveStoredLocale } from '../utils/storage';
import { MESSAGES, type MessagesSchema } from './messages';

interface I18nContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: MessagesSchema;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());

  useEffect(() => {
    applyLocaleToDocument(locale);
    saveStoredLocale(locale);
    document.title = MESSAGES[locale].meta.title;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
        t: MESSAGES[locale],
        setLocale,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
