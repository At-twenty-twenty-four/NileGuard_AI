'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { IncidentsList } from '@/components/incidents/incidents-list';
import { Tab } from '@headlessui/react';

export default function IncidentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [locale, setLocale] = useState('en');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const tabs = ['All', 'Open', 'Investigating', 'Contained', 'Resolved'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Incidents</h1>
              <p className="text-muted-foreground mt-2">Track and manage all security incidents</p>
            </div>

            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 bg-card p-1 rounded-lg border border-border overflow-x-auto">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `px-6 py-3 font-medium text-sm rounded transition whitespace-nowrap ${
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
                {tabs.map((tab) => (
                  <Tab.Panel key={tab}>
                    <IncidentsList locale={locale} status={tab === 'All' ? undefined : tab.toLowerCase()} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </main>
      </div>
    </div>
  );
}
