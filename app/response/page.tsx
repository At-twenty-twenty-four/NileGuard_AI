'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { AIResponseConsole } from '@/components/response/ai-response-console';
import { AutonomousActions } from '@/components/response/autonomous-actions';
import { ResponsePolicies } from '@/components/response/response-policies';
import { ActionHistory } from '@/components/response/action-history';
import { Tab } from '@headlessui/react';

export default function ResponsePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [locale, setLocale] = useState('en');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const tabs = ['AI Response Engine', 'Action History', 'Policies'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">SentinelAI-X Autonomous Response</h1>
              <p className="text-muted-foreground mt-2">Real-time threat response with confidence scoring</p>
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
                  <AIResponseConsole locale={locale} />
                </Tab.Panel>
                <Tab.Panel>
                  <ActionHistory />
                </Tab.Panel>
                <Tab.Panel>
                  <ResponsePolicies />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </main>
      </div>
    </div>
  );
}
