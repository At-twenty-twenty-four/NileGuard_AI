export const locales = ['en', 'am'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ (Amharic)',
};
