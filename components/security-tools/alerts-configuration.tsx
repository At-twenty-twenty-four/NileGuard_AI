'use client';

import { useState } from 'react';
import { Bell, Plus, Edit2, Trash2, X, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AlertRule {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  condition: string;
  notification: string;
  enabled: boolean;
  action: string;
}

export function AlertsConfiguration() {
  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Critical Vulnerability Detected',
      severity: 'critical',
      condition: 'CVSS Score > 9.0',
      notification: 'Email & SMS',
      enabled: true,
      action: 'Auto-isolate asset',
    },
    {
      id: '2',
      name: 'Brute Force Attack',
      severity: 'high',
      condition: 'Failed login attempts > 10 in 5 min',
      notification: 'Email & Slack',
      enabled: true,
      action: 'Block IP address',
    },
    {
      id: '3',
      name: 'Suspicious Network Activity',
      severity: 'medium',
      condition: 'Unusual data exfiltration detected',
      notification: 'Email',
      enabled: true,
      action: 'Alert SOC team',
    },
    {
      id: '4',
      name: 'Malware Detection',
      severity: 'high',
      condition: 'Known malware signature detected',
      notification: 'Email & SMS & Slack',
      enabled: true,
      action: 'Quarantine & scan',
    },
  ]);

  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [formData, setFormData] = useState<Partial<AlertRule>>({});
  const [showViewDetails, setShowViewDetails] = useState(false);

  const handleAddRule = () => {
    if (formData.name && formData.severity && formData.condition) {
      const newRule: AlertRule = {
        id: String(rules.length + 1),
        name: formData.name,
        severity: formData.severity as AlertRule['severity'],
        condition: formData.condition,
        notification: formData.notification || 'Email',
        enabled: true,
        action: formData.action || 'Alert',
      };
      setRules([...rules, newRule]);
      setFormData({});
      setShowAddRule(false);
    }
  };

  const handleUpdateRule = () => {
    if (editingRule && formData.name && formData.severity && formData.condition) {
      setRules(rules.map(r => r.id === editingRule.id ? {
        ...editingRule,
        name: formData.name,
        severity: formData.severity as AlertRule['severity'],
        condition: formData.condition,
        notification: formData.notification || editingRule.notification,
        action: formData.action || editingRule.action,
      } : r));
      setEditingRule(null);
      setFormData({});
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Alert Rules Configuration
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage alert triggers and notification channels
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddRule(true);
            setFormData({});
            setEditingRule(null);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Alert Rule
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Rules</p>
          <p className="text-2xl font-bold text-foreground mt-1">{rules.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Active</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{rules.filter(r => r.enabled).length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Critical</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{rules.filter(r => r.severity === 'critical').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase">High Priority</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{rules.filter(r => r.severity === 'high').length}</p>
        </div>
      </div>

      {/* Alert Rules List */}
      <div className="space-y-3">
        {rules.map(rule => (
          <div key={rule.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`mt-1 p-2 rounded transition ${
                    rule.enabled ? 'bg-primary/20 text-primary' : 'bg-background text-muted-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{rule.name}</h3>
                    <Badge className={getSeverityColor(rule.severity)}>
                      {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2"><span className="font-medium">Condition:</span> {rule.condition}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <p><span className="font-medium">Notification:</span> {rule.notification}</p>
                    <p><span className="font-medium">Action:</span> {rule.action}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => {
                    setEditingRule(rule);
                    setFormData(rule);
                    setShowAddRule(true);
                  }}
                  className="p-2 hover:bg-background rounded transition text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 hover:bg-destructive/20 rounded transition text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingRule ? 'Edit Alert Rule' : 'Create New Alert Rule'}
              </h2>
              <button
                onClick={() => {
                  setShowAddRule(false);
                  setEditingRule(null);
                  setFormData({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Rule Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  placeholder="e.g., Critical Vulnerability Detected"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Severity</label>
                  <select
                    value={formData.severity || 'high'}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as AlertRule['severity'] }))}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Notification</label>
                  <select
                    value={formData.notification || 'Email'}
                    onChange={(e) => setFormData(prev => ({ ...prev, notification: e.target.value }))}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                  >
                    <option>Email</option>
                    <option>Email & SMS</option>
                    <option>Email & Slack</option>
                    <option>Email & SMS & Slack</option>
                    <option>All Channels</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Trigger Condition</label>
                <textarea
                  value={formData.condition || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground min-h-20"
                  placeholder="e.g., CVSS Score > 9.0 OR Malware detected OR Failed login attempts > 10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Automatic Action</label>
                <select
                  value={formData.action || 'Alert'}
                  onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                >
                  <option>Alert</option>
                  <option>Alert SOC team</option>
                  <option>Block IP address</option>
                  <option>Auto-isolate asset</option>
                  <option>Quarantine & scan</option>
                  <option>Create incident</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddRule(false);
                  setEditingRule(null);
                  setFormData({});
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingRule) {
                    handleUpdateRule();
                  } else {
                    handleAddRule();
                  }
                }}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {editingRule ? 'Update' : 'Create'} Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
