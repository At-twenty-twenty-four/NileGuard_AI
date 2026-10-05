'use client';

import { Menu, X, Shield, Activity, AlertTriangle, Brain, Zap, Database, Settings, Zap as SecurityZap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathnameHook = usePathname();
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(pathnameHook);
  }, [pathnameHook]);

  const navItems = [
    { icon: Shield, label: 'Dashboard', href: '/' },
    { icon: AlertTriangle, label: 'Threats', href: '/threats' },
    { icon: Activity, label: 'Incidents', href: '/incidents' },
    { icon: Database, label: 'Intelligence', href: '/intelligence' },
    { icon: Brain, label: 'AI Response', href: '/response' },
    { icon: Zap, label: 'Digital Twin', href: '/simulator' },
    { icon: SecurityZap, label: 'Security Tools', href: '/security-tools' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-card rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } lg:w-64 overflow-hidden`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground">EthioShield</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-border">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">v1.0.0</p>
              <p className="text-xs text-muted-foreground">SentinelAI-X Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
