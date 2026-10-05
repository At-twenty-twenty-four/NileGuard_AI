'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/i18n';
import { useI18n } from '@/lib/i18n-context';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[language]}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
          {Object.entries(SUPPORTED_LANGUAGES).map(([lang, label]) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
