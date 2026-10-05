'use client';

import { useState } from 'react';
import { Settings, Lock, Database, Power, Save, X, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { ComplianceStatus } from '@/components/compliance-status';
import { PerformanceDashboard } from '@/components/performance-dashboard';
import { GDPRDashboard } from '@/components/gdpr-dashboard';
import { ThreatNetworkVisualization } from '@/components/threat-network-visualization';
import { EnterpriseAuditLogs } from '@/components/enterprise-audit-logs';

interface SettingsProps {
  locale: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
}

export function SettingsDashboard({ locale }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'compliance' | 'performance' | 'localization' | 'gdpr' | 'threats' | 'audit'>('general');
  const [settings, setSettings] = useState({
    orgName: 'EthioShield Organization',
    email: 'admin@ethioshield.com',
    alertThreshold: 70,
    autoResponse: true,
    loggingEnabled: true,
    dataRetention: 90,
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showApiModal, setShowApiModal] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Wazuh Integration', key: 'sk_live_51H****', created: '2026-06-15', lastUsed: '2026-06-24' },
    { id: '2', name: 'VirusTotal API', key: 'sk_live_52K****', created: '2026-06-10', lastUsed: '2026-06-23' },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleSave = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAddApiKey = () => {
    if (newKeyName.trim()) {
      const newKey: ApiKey = {
        id: String(apiKeys.length + 1),
        name: newKeyName,
        key: `sk_live_${Math.random().toString(36).substr(2, 9)}****`,
        created: new Date().toISOString().split('T')[0],
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
    }
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const texts = {
    en: {
      title: 'Organization Settings',
      description: 'Configure platform behavior, alerts, and security policies',
      general: 'General Settings',
      security: 'Security & Monitoring',
      alerts: 'Alert Configuration',
      dataManagement: 'Data Management',
      orgName: 'Organization Name',
      email: 'Administrator Email',
      alertThreshold: 'Alert Threshold (%)',
      autoResponse: 'Enable Autonomous Response',
      loggingEnabled: 'Enable Audit Logging',
      dataRetention: 'Data Retention (Days)',
      saveChanges: 'Save Changes',
      advancedSettings: 'Advanced Settings',
      apiKeys: 'API Keys',
      integrations: 'Integrations',
      saved: 'Settings saved successfully',
    },
    am: {
      title: 'ድርጅታዊ ቅንጅቶች',
      description: 'መድረክ ባህሪ, ማወሳወሶች, እና ደህንነት ፖሊሲዎች ያቋቁሙ',
      general: 'አጠቃላይ ቅንጅቶች',
      security: 'ደህንነት እና ክትትል',
      alerts: 'ማወሳወስ ቅንጅት',
      dataManagement: 'ውሂብ ግንኙነት',
      orgName: 'ድርጅታዊ ስም',
      email: 'አስተዳዳሪ ኢሜል',
      alertThreshold: 'ማወሳወስ ደረጃ (%)',
      autoResponse: 'ራስ-ሰር ምላሽ ያስቻሉ',
      loggingEnabled: 'የመርምር ምዝግብ ያስቻሉ',
      dataRetention: 'ውሂብ ጉቦ (ቀናት)',
      saveChanges: 'ለውጦችን ያስቀምጡ',
      advancedSettings: 'የላቀ ቅንጅቶች',
      apiKeys: 'API ቁልፎች',
      integrations: 'ውህደቶች',
      saved: 'ቅንጅቶች በተሳካ ሁኔታ ተቀምጠዋል',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0 overflow-x-auto">
        {[
          { id: 'general', label: 'General' },
          { id: 'compliance', label: 'Compliance & Security' },
          { id: 'performance', label: 'Performance' },
          { id: 'localization', label: 'Localization' },
          { id: 'gdpr', label: 'GDPR Privacy' },
          { id: 'threats', label: 'Threat Intelligence' },
          { id: 'audit', label: 'Enterprise Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              {t.general}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.orgName}
                </label>
                <Input
                  value={settings.orgName}
                  onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                  className="bg-background/50 border-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.email}
                </label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-background/50 border-primary/30"
                />
              </div>
            </div>
          </div>

          {/* Security & Monitoring */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              {t.security}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                <div>
                  <p className="font-medium text-foreground">{t.autoResponse}</p>
                  <p className="text-sm text-muted-foreground">Automatically respond to detected threats</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoResponse: !settings.autoResponse })}
                  className={`p-2 rounded-lg transition ${
                    settings.autoResponse ? 'bg-primary/20 text-primary' : 'bg-background text-muted-foreground'
                  }`}
                >
                  <Power className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                <div>
                  <p className="font-medium text-foreground">{t.loggingEnabled}</p>
                  <p className="text-sm text-muted-foreground">Enable comprehensive audit logging</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, loggingEnabled: !settings.loggingEnabled })}
                  className={`p-2 rounded-lg transition ${
                    settings.loggingEnabled ? 'bg-primary/20 text-primary' : 'bg-background text-muted-foreground'
                  }`}
                >
                  <Power className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.alertThreshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Low</span>
                  <span className="font-semibold text-primary">{settings.alertThreshold}%</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              {t.dataManagement}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.dataRetention}
                </label>
                <Input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
                  className="bg-background/50 border-primary/30"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Data older than this will be archived or deleted
                </p>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-sm text-orange-500 font-medium mb-2">Storage Usage</p>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">655 GB / 1000 GB used</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={saveStatus === 'saving'}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? t.saved : t.saveChanges}
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Advanced Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{t.advancedSettings}</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowApiModal(true)}
                className="w-full p-3 bg-background/50 rounded-lg hover:bg-background transition text-left font-medium text-primary text-sm"
              >
                {t.apiKeys}
              </button>
              <button 
                onClick={() => setShowIntegrationsModal(true)}
                className="w-full p-3 bg-background/50 rounded-lg hover:bg-background transition text-left font-medium text-primary text-sm"
              >
                {t.integrations}
              </button>
              <button 
                onClick={() => setShowExportModal(true)}
                className="w-full p-3 bg-background/50 rounded-lg hover:bg-background transition text-left font-medium text-destructive text-sm"
              >
                Export Logs
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Status</span>
                <Badge className="bg-green-500/20 text-green-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-green-500/20 text-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cache</span>
                <Badge className="bg-green-500/20 text-green-500">Active</Badge>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Platform Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <p className="text-xs text-muted-foreground">Version</p>
                <p className="font-semibold text-foreground">1.0.0 (Enterprise)</p>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-semibold text-foreground">2026-06-23</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div>
          <ComplianceStatus />
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <PerformanceDashboard />
        </div>
      )}

      {/* Localization Tab */}
      {activeTab === 'localization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Language & Regional Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Language
                    </label>
                    <div className="max-w-xs">
                      <LanguageSwitcher />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Choose your preferred language for the interface. Changes will apply immediately.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Theme Selection
                    </label>
                    <div className="max-w-xs">
                      <ThemeToggle />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Switch between dark, light, and system themes for better visibility.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Supported Languages</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-background/50 rounded">English</div>
                      <div className="p-2 bg-background/50 rounded">Español</div>
                      <div className="p-2 bg-background/50 rounded">Français</div>
                      <div className="p-2 bg-background/50 rounded">Deutsch</div>
                      <div className="p-2 bg-background/50 rounded">中文</div>
                      <div className="p-2 bg-background/50 rounded">العربية</div>
                      <div className="p-2 bg-background/50 rounded">日本語</div>
                      <div className="p-2 bg-background/50 rounded">Português</div>
                      <div className="p-2 bg-background/50 rounded">Русский</div>
                      <div className="p-2 bg-background/50 rounded">Italiano</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h4 className="font-semibold mb-4">Localization Info</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Current Language</p>
                <p className="font-medium">English (Default)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Theme Mode</p>
                <p className="font-medium">Dark</p>
              </div>
              <div>
                <p className="text-muted-foreground">Regional Format</p>
                <p className="font-medium">ISO 8601 (UTC)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Privacy Tab */}
      {activeTab === 'gdpr' && (
        <div className="space-y-6">
          <GDPRDashboard />
        </div>
      )}

      {/* Threat Intelligence Tab */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <ThreatNetworkVisualization title="Real-Time Threat Network Analysis" threatsCount={42} />
        </div>
      )}

      {/* Enterprise Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <EnterpriseAuditLogs title="Complete Enterprise Audit Trail" />
        </div>
      )}

      {/* API Keys Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-foreground">API Keys Management</h2>
              <button onClick={() => setShowApiModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Create New API Key</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Key name (e.g., Wazuh Integration)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-background/50"
                  />
                  <Button onClick={handleAddApiKey} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Active Keys ({apiKeys.length})</h3>
                {apiKeys.map(key => (
                  <div key={key.id} className="p-4 bg-background/50 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{key.name}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-2 hover:bg-background rounded transition text-muted-foreground hover:text-foreground"
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="p-2 hover:bg-background rounded transition text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApiKey(key.id)}
                          className="p-2 hover:bg-destructive/20 rounded transition text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-2">
                      {visibleKeys.has(key.id) ? key.key : '••••••••••••••••••••'}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Created: {key.created}</span>
                      <span>{key.lastUsed ? `Last used: ${key.lastUsed}` : 'Never used'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowApiModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Configuration Modal */}
      {showIntegrationsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-foreground">Integrations Configuration</h2>
              <button onClick={() => setShowIntegrationsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { name: 'Wazuh SIEM', status: 'connected', config: 'API Key: ••••••••, Endpoint: wazuh.example.com' },
                { name: 'Suricata IDS', status: 'connected', config: 'API Key: ••••••••, Endpoint: suricata.example.com' },
                { name: 'VirusTotal', status: 'connected', config: 'API Key: ••••••••, Rate limit: 4/min' },
                { name: 'TheHive', status: 'pending', config: 'Awaiting configuration' },
                { name: 'SHODAN', status: 'disconnected', config: 'Not configured' },
              ].map((integration, idx) => (
                <div key={idx} className="p-4 bg-background/50 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{integration.name}</p>
                    <Badge className={`${
                      integration.status === 'connected' ? 'bg-green-500/20 text-green-500' :
                      integration.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{integration.config}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs">Configure</Button>
                    <Button size="sm" variant="outline" className="text-xs">Test Connection</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowIntegrationsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Logs Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Export Logs</h2>
              <button onClick={() => setShowExportModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" className="bg-background/50" />
                  <Input type="date" className="bg-background/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Log Type</label>
                <select className="w-full bg-background border border-border rounded px-3 py-2 text-foreground">
                  <option>All Logs</option>
                  <option>Security Events</option>
                  <option>System Logs</option>
                  <option>API Access Logs</option>
                  <option>Error Logs</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Format</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="csv" defaultChecked />
                    <span className="text-sm text-foreground">CSV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="json" />
                    <span className="text-sm text-foreground">JSON</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="pdf" />
                    <span className="text-sm text-foreground">PDF</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Estimated size:</span> 2.5 MB
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>Cancel</Button>
              <Button onClick={() => {
                alert('Logs exported successfully!');
                setShowExportModal(false);
              }} className="bg-primary hover:bg-primary/90">
                Export Logs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
