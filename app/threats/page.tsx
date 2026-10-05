'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { ThreatActorsList } from '@/components/threats/threat-actors-list';
import { MalwareDatabase } from '@/components/threats/malware-database';
import { CVEDashboard } from '@/components/threats/cve-dashboard';
import { ActiveCampaigns } from '@/components/threats/active-campaigns';
import { Tab } from '@headlessui/react';
import { Globe, LogOut } from 'lucide-react';

export default function ThreatsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [locale, setLocale] = useState('en');
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('locale') || 'en';
    setLocale(stored);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const tabs = ['Threat Actors', 'Malware', 'Campaigns', 'Vulnerabilities'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Threat Intelligence Hub</h1>
              <p className="text-muted-foreground mt-2">Real-time threat actor profiles and malware analysis</p>
            </div>

            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 bg-card p-1 rounded-lg border border-border">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `px-6 py-3 font-medium text-sm rounded transition ${
                        selected
                          ? 'bg-primary/20 text-primary border border-primary/50'
                          : 'text-muted-foreground hover:text-foreground'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <ThreatActorsList locale={locale} />
                </Tab.Panel>
                <Tab.Panel>
                  <MalwareDatabase locale={locale} />
                </Tab.Panel>
                <Tab.Panel>
                  <ActiveCampaigns />
                </Tab.Panel>
                <Tab.Panel>
                  <CVEDashboard />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </main>
      </div>
    </div>
  );
}
