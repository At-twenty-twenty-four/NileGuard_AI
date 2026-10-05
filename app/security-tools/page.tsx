'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Settings, Plus, AlertTriangle, CheckCircle2, AlertCircle, Zap, Tabs, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SECURITY_TOOLS, TOOL_CATEGORIES } from '@/lib/security-tools-config';
import { ToolSetupGuide } from '@/components/security-tools/tool-setup-guide';
import { AlertsConfiguration } from '@/components/security-tools/alerts-configuration';
import { Tab } from '@headlessui/react';

export default function SecurityToolsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [locale, setLocale] = useState('en');
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddTool, setShowAddTool] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', category: 'SIEM', apiKey: '', apiUrl: '' });

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'wazuh':
        return '🛡️';
      case 'suricata':
        return '🔍';
      case 'virustotal':
        return '🦠';
      case 'thehive':
        return '👁️';
      case 'shodan':
        return '🌐';
      default:
        return '⚙️';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-8 h-8 text-primary" />
                  Integrated Security Tools
                </h1>
                <p className="text-muted-foreground mt-2">Manage and monitor all connected security tools and platforms</p>
              </div>
              <Button className="gap-2" onClick={() => setShowAddTool(true)}>
                <Plus className="w-4 h-4" />
                Add New Tool
              </Button>
            </div>

            {/* Tabs */}
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 bg-card p-1 rounded-lg border border-border">
                <Tab
                  className={({ selected }) =>
                    `px-6 py-3 font-medium text-sm rounded transition ${
                      selected
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  Integrated Tools
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-6 py-3 font-medium text-sm rounded transition ${
                      selected
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  Setup Guide
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-6 py-3 font-medium text-sm rounded transition ${
                      selected
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  Alerts Configuration
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-card border border-green-700/30 rounded-lg p-6">
                      <p className="text-sm text-green-400 font-semibold uppercase">Connected</p>
                      <p className="text-3xl font-bold text-green-400 mt-2">5</p>
                      <p className="text-xs text-muted-foreground mt-2">All tools operational</p>
                    </div>
                    <div className="bg-card border border-primary/30 rounded-lg p-6">
                      <p className="text-sm text-primary font-semibold uppercase">Total Alerts</p>
                      <p className="text-3xl font-bold text-primary mt-2">37</p>
                      <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
                    </div>
                    <div className="bg-card border border-orange-700/30 rounded-lg p-6">
                      <p className="text-sm text-orange-400 font-semibold uppercase">Avg Response Time</p>
                      <p className="text-3xl font-bold text-orange-400 mt-2">2.3s</p>
                      <p className="text-xs text-muted-foreground mt-2">Tool integration latency</p>
                    </div>
                    <div className="bg-card border border-blue-700/30 rounded-lg p-6">
                      <p className="text-sm text-blue-400 font-semibold uppercase">Uptime</p>
                      <p className="text-3xl font-bold text-blue-400 mt-2">99.8%</p>
                      <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
                    </div>
                  </div>

                  {/* Tools by Category */}
                  <div className="mt-6 space-y-6">
                    {(['SIEM', 'IDS/IPS', 'Reputation', 'Incidents', 'Discovery'] as const).map((category) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  {TOOL_CATEGORIES[category]}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {SECURITY_TOOLS.filter(t => t.category === category).map((tool) => (
                    <div key={tool.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition">
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-3xl">{getToolIcon(tool.id)}</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusIcon(tool.status)}
                          <Badge 
                            className={
                              tool.enabled 
                                ? 'bg-green-900/20 text-green-400' 
                                : 'bg-gray-900/20 text-gray-400'
                            }
                          >
                            {tool.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>

                      {/* Tool Details */}
                      <div className="bg-background/30 rounded-lg p-4 mb-4 border border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                            <p className="text-sm text-foreground mt-1 capitalize">{tool.status}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Last Sync</p>
                            <p className="text-sm text-foreground mt-1">{tool.lastSync}</p>
                          </div>
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.capabilities.map((cap, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => alert(`Configure ${tool.name}\nAPI URL: ${tool.apiUrl}\nStatus: ${tool.status}`)}
                        >
                          Configure
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary"
                          onClick={() => alert(`View Alerts for ${tool.name}\nRecent alerts will be displayed here`)}
                        >
                          View Alerts
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

                    {/* Integration Guide */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-foreground mb-3">Integration Setup Guide</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-foreground mb-2">Quick Start</p>
                          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                            <li>Click "Configure" on any tool to set up API credentials</li>
                            <li>Test connection before enabling</li>
                            <li>Enable tool to start receiving alerts</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-2">Troubleshooting</p>
                          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                            <li>Verify API keys are correct</li>
                            <li>Check network connectivity</li>
                            <li>Review tool logs for errors</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="mt-6">
                    <ToolSetupGuide />
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="mt-6">
                    <AlertsConfiguration />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {/* Add Tool Modal */}
            {showAddTool && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-lg max-w-lg w-full">
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Add New Security Tool</h2>
                    <button 
                      onClick={() => setShowAddTool(false)} 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Tool Name</label>
                      <input
                        type="text"
                        value={newTool.name}
                        onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                        placeholder="e.g., Custom SIEM"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Category</label>
                      <select
                        value={newTool.category}
                        onChange={(e) => setNewTool(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                      >
                        <option value="SIEM">SIEM & Event Management</option>
                        <option value="IDS/IPS">IDS/IPS</option>
                        <option value="Reputation">File Reputation</option>
                        <option value="Incidents">Incident Management</option>
                        <option value="Discovery">Asset Discovery</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">API URL</label>
                      <input
                        type="url"
                        value={newTool.apiUrl}
                        onChange={(e) => setNewTool(prev => ({ ...prev, apiUrl: e.target.value }))}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                        placeholder="https://api.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">API Key</label>
                      <input
                        type="password"
                        value={newTool.apiKey}
                        onChange={(e) => setNewTool(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                        placeholder="Enter API key"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 p-6 border-t border-border">
                    <Button variant="outline" onClick={() => setShowAddTool(false)}>Cancel</Button>
                    <Button 
                      onClick={() => {
                        if (newTool.name && newTool.apiKey && newTool.apiUrl) {
                          alert(`Tool "${newTool.name}" added successfully to ${newTool.category}`);
                          setShowAddTool(false);
                          setNewTool({ name: '', category: 'SIEM', apiKey: '', apiUrl: '' });
                        }
                      }}
                    >
                      Add Tool
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
