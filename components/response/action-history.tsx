'use client';

import { useState } from 'react';
import { History, Eye, CheckCircle, AlertCircle, Clock, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActionRecord {
  id: string;
  threatId: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  executedBy: string;
  resultDetails: string;
  affectedSystems: string[];
  logs: string[];
}

const actionHistory: ActionRecord[] = [
  {
    id: 'ACT-001',
    threatId: 'THR-2024-001',
    action: 'Block IP',
    status: 'success',
    timestamp: '2024-01-20 14:32:15',
    executedBy: 'AI Response Engine',
    resultDetails: 'Successfully blocked source IP 192.168.1.105 across all firewalls',
    affectedSystems: ['Firewall-Primary', 'Firewall-Secondary', 'IPS-01'],
    logs: [
      '[14:32:15] Initiating IP block operation',
      '[14:32:16] Firewall rule created: DENY 192.168.1.105 ALL',
      '[14:32:17] IPS updated with new threat signature',
      '[14:32:18] Block operation completed successfully',
    ],
  },
  {
    id: 'ACT-002',
    threatId: 'THR-2024-001',
    action: 'Isolate System',
    status: 'success',
    timestamp: '2024-01-20 14:32:45',
    executedBy: 'AI Response Engine',
    resultDetails: 'System 192.168.1.105 has been isolated from network',
    affectedSystems: ['WORKSTATION-42'],
    logs: [
      '[14:32:45] Starting system isolation',
      '[14:32:46] Network interface disabled',
      '[14:32:47] VPN access revoked',
      '[14:32:48] Isolation complete - system in quarantine',
    ],
  },
  {
    id: 'ACT-003',
    threatId: 'THR-2024-002',
    action: 'Quarantine File',
    status: 'success',
    timestamp: '2024-01-20 14:15:32',
    executedBy: 'Automated Security',
    resultDetails: 'Malicious file moved to quarantine vault',
    affectedSystems: ['WORKSTATION-15', 'BACKUP-VAULT'],
    logs: [
      '[14:15:32] File hash: a1b2c3d4e5f6',
      '[14:15:33] Scanning: Detected 4 malware signatures',
      '[14:15:34] File moved to: /quarantine/2024-01-20/',
      '[14:15:35] Quarantine lock applied',
    ],
  },
  {
    id: 'ACT-004',
    threatId: 'THR-2024-003',
    action: 'Block Sender',
    status: 'pending',
    timestamp: '2024-01-20 13:50:22',
    executedBy: 'Email Security',
    resultDetails: 'Email filter rule being applied across organization',
    affectedSystems: ['Exchange-01', 'Email-Gateway'],
    logs: [
      '[13:50:22] Creating email filter rule',
      '[13:50:23] Rule: attacker@spoofed-domain.com -> REJECT',
      '[13:50:24] Applying to all mailboxes...',
    ],
  },
  {
    id: 'ACT-005',
    threatId: 'THR-2024-003',
    action: 'Report to Security',
    status: 'failed',
    timestamp: '2024-01-20 13:45:00',
    executedBy: 'Alert System',
    resultDetails: 'Failed to send report - SMTP service temporarily unavailable',
    affectedSystems: ['SMTP-Server'],
    logs: [
      '[13:45:00] Attempting to send security alert',
      '[13:45:01] SMTP connection refused',
      '[13:45:02] Retrying connection...',
      '[13:45:03] Failed - Service unavailable (will retry)',
    ],
  },
];

interface ActionDetailsModalProps {
  action: ActionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

function ActionDetailsModal({ action, isOpen, onClose }: ActionDetailsModalProps) {
  if (!isOpen || !action) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Action Details</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Action ID</p>
              <p className="text-sm text-foreground mt-1">{action.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Threat ID</p>
              <p className="text-sm text-foreground mt-1">{action.threatId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Action</p>
              <p className="text-sm text-foreground mt-1">{action.action}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
              <Badge className={`${getStatusColor(action.status)} border text-xs mt-1 capitalize`}>
                {action.status}
              </Badge>
            </div>
          </div>

          {/* Execution Info */}
          <div className="p-4 bg-background/50 rounded-lg border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Timestamp</p>
                <p className="text-sm text-foreground mt-1">{action.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Executed By</p>
                <p className="text-sm text-foreground mt-1">{action.executedBy}</p>
              </div>
            </div>
          </div>

          {/* Result Details */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Result Details</p>
            <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded border border-border">
              {action.resultDetails}
            </p>
          </div>

          {/* Affected Systems */}
          {action.affectedSystems.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Affected Systems</p>
              <div className="grid grid-cols-2 gap-2">
                {action.affectedSystems.map((system, idx) => (
                  <div key={idx} className="bg-background/50 border border-border rounded p-2">
                    <p className="text-sm text-foreground">{system}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Logs */}
          {action.logs.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Execution Logs</p>
              <div className="bg-background/50 border border-border rounded p-4 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                {action.logs.map((log, idx) => (
                  <p key={idx} className="text-muted-foreground">
                    <span className="text-primary">{log.split(']')[0]}]</span>
                    {log.substring(log.indexOf(']') + 1)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="bg-primary/20 text-primary hover:bg-primary/30"
            onClick={() => alert(`Comment on Action ${action.id}:\n\nAdd your comment about this action:\n- Action success/failure analysis\n- Additional notes for team\n- Recommendations for improvement`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ActionHistory() {
  const [selectedAction, setSelectedAction] = useState<ActionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-yellow-500/10 border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Action History</h2>
      </div>

      {/* Action List */}
      <div className="space-y-3">
        {actionHistory.map((action) => (
          <div
            key={action.id}
            className={`bg-card border rounded-lg p-4 hover:border-primary/50 transition ${getStatusColor(action.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(action.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{action.action}</h3>
                    <Badge variant="outline" className="text-xs">
                      {action.id}
                    </Badge>
                    <Badge className="text-xs">{action.threatId}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.resultDetails}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Executed by: {action.executedBy}</span>
                    <span>{action.timestamp}</span>
                    {action.affectedSystems.length > 0 && (
                      <span>{action.affectedSystems.length} systems affected</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAction(action);
                  setIsModalOpen(true);
                }}
                className="ml-4"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ActionDetailsModal action={selectedAction} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
