'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, AlertCircle, Plus, Settings, Activity, Activity as IdsIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SECURITY_TOOLS, TOOL_CATEGORIES } from '@/lib/security-tools-config';

interface ToolStatus {
  toolId: string;
  enabled: boolean;
  connected: boolean;
  alertCount: number;
  lastSync: string;
}

const TOOL_STATUSES: ToolStatus[] = [
  { toolId: 'wazuh', enabled: true, connected: true, alertCount: 23, lastSync: '5m ago' },
  { toolId: 'suricata', enabled: true, connected: true, alertCount: 8, lastSync: '2m ago' },
  { toolId: 'virustotal', enabled: true, connected: true, alertCount: 2, lastSync: '10m ago' },
  { toolId: 'thehive', enabled: true, connected: true, alertCount: 3, lastSync: '15m ago' },
  { toolId: 'shodan', enabled: true, connected: true, alertCount: 1, lastSync: '20m ago' },
];

export function SecurityToolsWidget() {
  const [showDetails, setShowDetails] = useState(false);
  const connectedTools = TOOL_STATUSES.filter(t => t.connected && t.enabled).length;
  const totalAlerts = TOOL_STATUSES.reduce((sum, t) => sum + t.alertCount, 0);

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
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Integrated Security Tools</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="w-3 h-3" />
          Add Tool
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-background/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Connected Tools</p>
          <p className="text-2xl font-bold text-primary mt-1">{connectedTools}/5</p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Active Alerts</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{totalAlerts}</p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground font-semibold">Health Status</p>
          <p className="text-lg font-bold text-green-400 mt-1">Optimal</p>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        {SECURITY_TOOLS.map((tool) => {
          const status = TOOL_STATUSES.find(t => t.toolId === tool.id);
          return (
            <div key={tool.id} className="bg-background/30 border border-border/50 rounded-lg p-3 hover:border-primary/30 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{getToolIcon(tool.id)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{tool.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status?.connected && status.enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {status && status.alertCount > 0 && (
                    <Badge className="bg-orange-900/20 text-orange-400 text-xs">
                      {status.alertCount}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{status?.lastSync}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border flex justify-between">
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </Button>
        <Button size="sm" variant="outline" className="gap-2">
          <Settings className="w-3 h-3" />
          Configure
        </Button>
      </div>

      {/* Detailed Capabilities */}
      {showDetails && (
        <div className="pt-4 border-t border-border space-y-3">
          {SECURITY_TOOLS.map((tool) => (
            <div key={tool.id} className="bg-background/20 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{tool.name} Capabilities</p>
              <div className="flex flex-wrap gap-1">
                {tool.capabilities.map((cap, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-primary/10">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
