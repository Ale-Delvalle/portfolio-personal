import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Lang, type Translation } from '../i18n/translations';

export const LANGUAGE_STORAGE_KEY = 'portfolio-lang';

interface LanguageContextValue {
  lang: Lang;
  t: Translation;
  setLang: (lang: Lang) => void;
}

function getInitialLang(): Lang {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'en' ? 'en' : 'es';
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  t: translations.es,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
