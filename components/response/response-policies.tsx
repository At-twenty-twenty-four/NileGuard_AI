'use client';

import { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Shield, AlertTriangle, CheckCircle, ToggleRight, ToggleLeft, X, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResponsePolicy {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  confidenceThreshold: number;
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impactLevel: 'high' | 'medium' | 'low';
  createdDate: string;
  lastModified: string;
}

const defaultPolicies: ResponsePolicy[] = [
  {
    id: 'POL-001',
    name: 'Critical Zero-Day Immediate Response',
    description: 'Automatically isolate affected systems when critical zero-day vulnerability is detected',
    triggers: ['CVE Detection', 'Severity >= Critical', 'Exploitation Evidence'],
    actions: ['Network Isolation', 'Incident Creation', 'Alert Security Team', 'Backup Systems'],
    confidenceThreshold: 0.85,
    enabled: true,
    severity: 'critical',
    impactLevel: 'high',
    createdDate: '2024-01-10',
    lastModified: '2024-01-22',
  },
  {
    id: 'POL-002',
    name: 'Ransomware Detection and Response',
    description: 'Respond to ransomware detection with file immutability and backup protection',
    triggers: ['Ransomware Signature', 'Unusual Encryption Activity', 'Multiple Failed Logins'],
    actions: ['Enable File Immutability', 'Backup Trigger', 'Block C2 Domains', 'Alert IR Team'],
    confidenceThreshold: 0.75,
    enabled: true,
    severity: 'critical',
    impactLevel: 'high',
    createdDate: '2024-01-08',
    lastModified: '2024-01-20',
  },
  {
    id: 'POL-003',
    name: 'Data Exfiltration Prevention',
    description: 'Prevent unauthorized data transfers based on traffic anomalies',
    triggers: ['Large Data Transfer', 'Anomalous Destination', 'Off-Hours Activity'],
    actions: ['Traffic Rate Limiting', 'Transfer Blocking', 'Source Investigation', 'Notification'],
    confidenceThreshold: 0.70,
    enabled: true,
    severity: 'high',
    impactLevel: 'medium',
    createdDate: '2024-01-15',
    lastModified: '2024-01-21',
  },
  {
    id: 'POL-004',
    name: 'Brute Force Attack Mitigation',
    description: 'Automatically lockdown accounts and rate-limit login attempts',
    triggers: ['Failed Login >= 5', 'Multiple Failed Auth', 'Distributed Attack'],
    actions: ['Account Lockdown', 'IP Blacklisting', 'CAPTCHA Enforcement', 'Security Alert'],
    confidenceThreshold: 0.60,
    enabled: true,
    severity: 'high',
    impactLevel: 'low',
    createdDate: '2024-01-12',
    lastModified: '2024-01-19',
  },
  {
    id: 'POL-005',
    name: 'Lateral Movement Detection Response',
    description: 'Detect and stop lateral movement within the network',
    triggers: ['Abnormal Lateral Traffic', 'Port Scanning', 'Service Enumeration'],
    actions: ['Network Segmentation Trigger', 'Suspicious User Isolation', 'Monitoring Activation'],
    confidenceThreshold: 0.65,
    enabled: false,
    severity: 'high',
    impactLevel: 'medium',
    createdDate: '2024-01-18',
    lastModified: '2024-01-21',
  },
];

export function ResponsePolicies() {
  const [policies, setPolicies] = useState<ResponsePolicy[]>(defaultPolicies);
  const [editingPolicy, setEditingPolicy] = useState<ResponsePolicy | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const togglePolicy = (id: string) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
      )
    );
  };

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter((policy) => policy.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/20 text-red-400 border-red-700/30';
      case 'high':
        return 'bg-orange-900/20 text-orange-400 border-orange-700/30';
      case 'medium':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30';
      case 'low':
        return 'bg-green-900/20 text-green-400 border-green-700/30';
      default:
        return 'bg-blue-900/20 text-blue-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  const handleSavePolicy = (updatedPolicy: ResponsePolicy) => {
    if (editingPolicy && editingPolicy.id) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? updatedPolicy : p));
    } else {
      setPolicies([...policies, { ...updatedPolicy, id: `POL-${Date.now()}` }]);
    }
    setEditingPolicy(null);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Automated Response Policies
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Configure threat response automation and confidence thresholds</p>
        </div>
        <Button 
          onClick={() => setIsAddingNew(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Policy
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Policies</p>
          <p className="text-2xl font-bold text-foreground mt-2">{policies.length}</p>
        </div>
        <div className="bg-card border border-green-700/30 rounded-lg p-4">
          <p className="text-xs text-green-400 uppercase font-semibold">Enabled</p>
          <p className="text-2xl font-bold text-green-400 mt-2">{policies.filter(p => p.enabled).length}</p>
        </div>
        <div className="bg-card border border-red-700/30 rounded-lg p-4">
          <p className="text-xs text-red-400 uppercase font-semibold">Disabled</p>
          <p className="text-2xl font-bold text-red-400 mt-2">{policies.filter(p => !p.enabled).length}</p>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={`bg-card border rounded-lg p-6 transition ${
              policy.enabled ? 'border-primary/30 bg-primary/5' : 'border-border opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{policy.name}</h3>
                  <Badge className={`${getSeverityColor(policy.severity)} border text-xs`}>
                    {policy.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{policy.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{policy.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => togglePolicy(policy.id)}
                  className="p-2 hover:bg-primary/10 rounded transition"
                  title={policy.enabled ? 'Disable' : 'Enable'}
                >
                  {policy.enabled ? (
                    <ToggleRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Triggers */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Triggers
              </p>
              <div className="flex flex-wrap gap-2">
                {policy.triggers.map((trigger, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Automated Actions
              </p>
              <div className="flex flex-wrap gap-2">
                {policy.actions.map((action, idx) => (
                  <Badge key={idx} className="bg-primary/20 text-primary text-xs border-primary/50 border">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-background/50 rounded-lg mb-4 border border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Confidence Threshold</p>
                <p className="text-lg font-bold text-primary mt-1">{Math.round(policy.confidenceThreshold * 100)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Impact Level</p>
                <p className={`text-lg font-bold mt-1 capitalize ${getImpactColor(policy.impactLevel)}`}>
                  {policy.impactLevel}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Created</p>
                <p className="text-sm text-foreground mt-1">{new Date(policy.createdDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Last Modified</p>
                <p className="text-sm text-foreground mt-1">{new Date(policy.lastModified).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setEditingPolicy(policy)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => deletePolicy(policy.id)}
                className="gap-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">💡 Tip:</span> Set higher confidence thresholds for policies with high business impact. Lower thresholds enable more aggressive threat response.
        </p>
      </div>

      {/* Policy Editor Modal */}
      {(editingPolicy || isAddingNew) && (
        <PolicyEditorModal
          policy={editingPolicy}
          onSave={handleSavePolicy}
          onClose={() => {
            setEditingPolicy(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
}

interface PolicyEditorModalProps {
  policy: ResponsePolicy | null;
  onSave: (policy: ResponsePolicy) => void;
  onClose: () => void;
}

function PolicyEditorModal({ policy, onSave, onClose }: PolicyEditorModalProps) {
  const [formData, setFormData] = useState<Partial<ResponsePolicy>>(
    policy || {
      name: '',
      description: '',
      triggers: [],
      actions: [],
      confidenceThreshold: 0.75,
      enabled: true,
      severity: 'high',
      impactLevel: 'medium',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    }
  );

  const handleSave = () => {
    if (formData.name && formData.description) {
      onSave(formData as ResponsePolicy);
    }
  };

  const addTrigger = () => {
    setFormData(prev => ({
      ...prev,
      triggers: [...(prev.triggers || []), '']
    }));
  };

  const removeTrigger = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers?.filter((_, i) => i !== idx) || []
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), '']
    }));
  };

  const removeAction = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== idx) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{policy ? 'Edit Policy' : 'New Policy'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Policy Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              placeholder="Enter policy name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground min-h-20"
              placeholder="Enter policy description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Severity</label>
              <select
                value={formData.severity || 'high'}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Confidence Threshold (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round((formData.confidenceThreshold || 0.75) * 100)}
                onChange={(e) => setFormData(prev => ({ ...prev, confidenceThreshold: parseInt(e.target.value) / 100 }))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Triggers</label>
              <Button size="sm" variant="outline" onClick={addTrigger} className="gap-1">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.triggers || []).map((trigger, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={trigger}
                    onChange={(e) => {
                      const newTriggers = [...(formData.triggers || [])];
                      newTriggers[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, triggers: newTriggers }));
                    }}
                    className="flex-1 bg-background border border-border rounded px-3 py-2 text-foreground"
                    placeholder="Enter trigger"
                  />
                  <Button size="sm" variant="outline" onClick={() => removeTrigger(idx)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Actions</label>
              <Button size="sm" variant="outline" onClick={addAction} className="gap-1">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.actions || []).map((action, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => {
                      const newActions = [...(formData.actions || [])];
                      newActions[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, actions: newActions }));
                    }}
                    className="flex-1 bg-background border border-border rounded px-3 py-2 text-foreground"
                    placeholder="Enter action"
                  />
                  <Button size="sm" variant="outline" onClick={() => removeAction(idx)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Policy
          </Button>
        </div>
      </div>
    </div>
  );
}
