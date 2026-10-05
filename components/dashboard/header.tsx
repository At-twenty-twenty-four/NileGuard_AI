'use client';

import { Globe, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  onLocaleChange: (locale: string) => void;
  currentLocale: string;
  onLogout?: () => void;
}

export function Header({ onLocaleChange, currentLocale, onLogout }: HeaderProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      // Call the logout callback to update parent component
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between ml-16 lg:ml-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time threat monitoring</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-2 hover:bg-background rounded-lg transition flex items-center gap-2"
            >
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium uppercase">{currentLocale}</span>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    onLocaleChange('en');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-background ${
                    currentLocale === 'en' ? 'text-primary' : ''
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    onLocaleChange('am');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-background ${
                    currentLocale === 'am' ? 'text-primary' : ''
                  }`}
                >
                  አማርኛ (Amharic)
                </button>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-background rounded-lg transition"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-background text-destructive flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
