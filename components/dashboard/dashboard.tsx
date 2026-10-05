'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { ThreatOverview } from './threat-overview';
import { RecentAlerts } from './recent-alerts';
import { ThreatMetrics } from './threat-metrics';
import { SecurityToolsWidget } from './security-tools-widget';
import { LinuxMonitor } from './linux-monitor';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} onLogout={onLogout} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Threat Overview Cards */}
            <ThreatOverview locale={locale} />
            
            {/* Linux SSH monitoring and threat explanations */}
            <LinuxMonitor />

            {/* Security Tools Widget */}
            <SecurityToolsWidget />
            
            {/* Metrics */}
            <ThreatMetrics locale={locale} />
            
            {/* Recent Alerts */}
            <RecentAlerts locale={locale} />
          </div>
        </main>
      </div>
    </div>
  );
}
