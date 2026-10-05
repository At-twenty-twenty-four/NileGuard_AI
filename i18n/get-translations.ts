import { Locale, locales } from './config';

type Messages = typeof import('./locales/en.json');

const translations: Record<Locale, Messages> = {
  en: require('./locales/en.json'),
  am: require('./locales/am.json'),
};

export function getTranslations(locale: Locale): Messages {
  if (!locales.includes(locale)) {
    return translations['en'];
  }
  return translations[locale];
}

export function useTranslations(locale: Locale) {
  const messages = getTranslations(locale);
  
  return function t(key: string, defaultValue?: string): string {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || defaultValue || key;
  };
}
