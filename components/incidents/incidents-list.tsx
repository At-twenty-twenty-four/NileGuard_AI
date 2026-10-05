'use client';

import { useState } from 'react';
import { Calendar, AlertTriangle, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IncidentDetailsModal } from './incident-details-modal';

interface IncidentsListProps {
  locale: string;
  status?: string;
}

const incidents = [
  {
    id: 'INC-2024-001',
    title: 'Unauthorized Network Scan Detected',
    type: 'Intrusion',
    severity: 'critical',
    status: 'investigating',
    created: '2024-01-20 14:32',
    updated: '2024-01-20 14:45',
    actor: 'Unknown',
    affectedSystems: 3,
    description: 'Multiple port scans detected from internal IP 192.168.1.105',
  },
  {
    id: 'INC-2024-002',
    title: 'Malware Detected in Downloads',
    type: 'Malware',
    severity: 'high',
    status: 'contained',
    created: '2024-01-20 13:15',
    updated: '2024-01-20 14:30',
    actor: 'Emotet',
    affectedSystems: 1,
    description: 'Suspicious executable detected and quarantined',
  },
  {
    id: 'INC-2024-003',
    title: 'Phishing Campaign Targeting Finance Team',
    type: 'Phishing',
    severity: 'high',
    status: 'open',
    created: '2024-01-20 10:20',
    updated: '2024-01-20 11:45',
    actor: 'Unknown Group',
    affectedSystems: 8,
    description: 'Targeted spear-phishing emails impersonating CEO',
  },
  {
    id: 'INC-2024-004',
    title: 'DDoS Attack Attempt',
    type: 'DDoS',
    severity: 'medium',
    status: 'resolved',
    created: '2024-01-19 23:45',
    updated: '2024-01-20 03:20',
    actor: 'Mirai Botnet',
    affectedSystems: 5,
    description: 'High-volume UDP flood attack blocked by WAF',
  },
  {
    id: 'INC-2024-005',
    title: 'Lateral Movement Detected',
    type: 'Intrusion',
    severity: 'critical',
    status: 'investigating',
    created: '2024-01-19 18:30',
    updated: '2024-01-20 14:50',
    actor: 'APT-33',
    affectedSystems: 6,
    description: 'Suspicious lateral movement across network segments',
  },
];

export function IncidentsList({ locale, status }: IncidentsListProps) {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = status
    ? incidents.filter((inc) => inc.status === status.toLowerCase())
    : incidents;

  const handleViewDetails = (incident: any) => {
    setSelectedIncident({
      ...incident,
      startTime: new Date(incident.created).toISOString(),
      endTime: incident.status === 'resolved' ? new Date(incident.updated).toISOString() : null,
      relatedAlerts: [`Alert-${incident.id}-001`, `Alert-${incident.id}-002`, `Alert-${incident.id}-003`],
      affectedAssets: Array.from({ length: incident.affectedSystems }, (_, i) => `Server-${String.fromCharCode(65 + i)}`),
      timeline: [
        {
          timestamp: incident.created,
          eventType: 'detection',
          description: `Threat detected: ${incident.title}`,
        },
        {
          timestamp: new Date(new Date(incident.created).getTime() + 5 * 60000).toISOString(),
          eventType: 'investigation',
          description: 'Incident investigation initiated',
          actionTaken: 'Isolation initiated',
        },
        {
          timestamp: incident.updated,
          eventType: incident.status === 'resolved' ? 'resolution' : 'action',
          description: `Incident status updated to ${incident.status}`,
          actionTaken: incident.status === 'resolved' ? 'Threat mitigated' : 'Continuing investigation',
        },
      ],
      rootCause: incident.actor !== 'Unknown' ? `Attributed to ${incident.actor}` : 'Investigation in progress',
      resolution: incident.status === 'resolved' ? 'Threat has been completely remediated' : null,
    });
    setIsModalOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      default:
        return 'bg-green-500/20 text-green-500 border-green-500/50';
    }
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'open':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'investigating':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'contained':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'resolved':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No incidents found</p>
        </div>
      ) : (
        filtered.map((incident) => (
          <div
            key={incident.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{incident.title}</h3>
                  <Badge className="text-xs">{incident.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Badge className={`${getSeverityColor(incident.severity)} border text-xs text-center`}>
                  {incident.severity.toUpperCase()}
                </Badge>
                <Badge className={`${getStatusColor(incident.status)} border text-xs text-center`}>
                  {incident.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background/50 rounded-lg mb-4 border border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Type</p>
                <p className="text-sm text-foreground mt-1">{incident.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Threat Actor</p>
                <p className="text-sm text-foreground mt-1">{incident.actor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Affected Systems</p>
                <p className="text-sm text-foreground font-semibold mt-1">{incident.affectedSystems}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Created</p>
                <div className="flex items-center gap-1 text-sm text-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  {incident.created}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated: {incident.updated}
                </span>
              </div>
              <button 
                onClick={() => handleViewDetails(incident)}
                className="px-3 py-1 bg-primary/20 text-primary border border-primary/50 rounded hover:bg-primary/30 transition text-xs font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
