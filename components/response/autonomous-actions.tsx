'use client';

import { Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AutonomousActionsProps {
  locale: string;
}

const actionHistory = [
  {
    id: 'ACT-2024-001',
    timestamp: '2024-01-20 14:32:15',
    threat: 'Intrusion Detection',
    action: 'Block IP: 192.168.1.105',
    status: 'completed',
    confidence: 98,
    rollbackCapable: true,
    result: 'IP successfully blocked, 2 connections terminated',
  },
  {
    id: 'ACT-2024-002',
    timestamp: '2024-01-20 14:18:42',
    threat: 'Malware Detection',
    action: 'Quarantine File',
    status: 'completed',
    confidence: 94,
    rollbackCapable: true,
    result: 'File moved to secure quarantine, system scanned',
  },
  {
    id: 'ACT-2024-003',
    timestamp: '2024-01-20 13:45:21',
    threat: 'Data Exfiltration',
    action: 'Isolate System',
    status: 'completed',
    confidence: 91,
    rollbackCapable: true,
    result: 'System isolated, forensic imaging initiated',
  },
  {
    id: 'ACT-2024-004',
    timestamp: '2024-01-20 12:30:08',
    threat: 'Privilege Escalation',
    action: 'Kill Suspicious Process',
    status: 'completed',
    confidence: 89,
    rollbackCapable: false,
    result: 'Process PID 4821 terminated, child processes cleaned',
  },
  {
    id: 'ACT-2024-005',
    timestamp: '2024-01-20 11:15:33',
    threat: 'Lateral Movement',
    action: 'Block Network Segment',
    status: 'completed',
    confidence: 86,
    rollbackCapable: true,
    result: 'Network segment isolated, 15 devices protected',
  },
];

export function AutonomousActions({ locale }: AutonomousActionsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'failed':
        return 'bg-destructive/20 text-destructive border-destructive/50';
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Action History</h3>
        <div className="text-sm text-muted-foreground">
          {actionHistory.length} actions executed
        </div>
      </div>

      <div className="space-y-3">
        {actionHistory.map((action) => (
          <div
            key={action.id}
            className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(action.status)}
                <div>
                  <p className="font-semibold text-foreground">{action.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.id}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(action.status)} border text-xs`}>
                {action.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Timestamp</p>
                <p className="text-foreground">{action.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Threat Type</p>
                <p className="text-foreground">{action.threat}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">AI Confidence</p>
                <p className="text-foreground font-semibold">{action.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Rollback</p>
                <p className="text-foreground">
                  {action.rollbackCapable ? (
                    <span className="text-green-500">Available</span>
                  ) : (
                    <span className="text-orange-500">Not Available</span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-3 bg-background/50 rounded mb-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Result</p>
              <p className="text-sm text-foreground">{action.result}</p>
            </div>

            <div className="flex gap-2">
              {action.rollbackCapable && (
                <Button className="flex items-center gap-2 text-xs bg-warning/20 text-warning border border-warning/50 hover:bg-warning/30">
                  <RotateCcw className="w-3 h-3" />
                  Rollback
                </Button>
              )}
              <Button className="flex items-center gap-2 text-xs bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
