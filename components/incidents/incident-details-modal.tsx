'use client';

import { useState } from 'react';
import { X, AlertTriangle, Clock, User, Target, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IncidentDetailsModalProps {
  incident: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
    startTime: string;
    endTime?: string;
    assignedTo?: string;
    relatedAlerts: string[];
    affectedAssets: string[];
    rootCause?: string;
    resolution?: string;
    timeline?: Array<{
      timestamp: string;
      eventType: string;
      description: string;
      actionTaken?: string;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function IncidentDetailsModal({ incident, isOpen, onClose }: IncidentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'assets' | 'actions'>('overview');

  if (!isOpen) return null;

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
        return 'bg-blue-900/20 text-blue-400 border-blue-700/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-900/20 text-red-400';
      case 'investigating':
        return 'bg-yellow-900/20 text-yellow-400';
      case 'contained':
        return 'bg-blue-900/20 text-blue-400';
      case 'resolved':
        return 'bg-green-900/20 text-green-400';
      case 'closed':
        return 'bg-slate-900/20 text-slate-400';
      default:
        return 'bg-slate-900/20 text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-primary/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-primary/10 p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{incident.title}</h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(incident.severity)}`}>
                {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incident.status)}`}>
                {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-primary/10 px-6">
          <div className="flex gap-8">
            {['overview', 'timeline', 'assets', 'actions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{incident.description}</p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Start Time</span>
                  </div>
                  <p className="text-foreground font-medium">{new Date(incident.startTime).toLocaleString()}</p>
                </div>

                {incident.endTime && (
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">End Time</span>
                    </div>
                    <p className="text-foreground font-medium">{new Date(incident.endTime).toLocaleString()}</p>
                  </div>
                )}

                {incident.assignedTo && (
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Assigned To</span>
                    </div>
                    <p className="text-foreground font-medium">{incident.assignedTo}</p>
                  </div>
                )}
              </div>

              {/* Root Cause */}
              {incident.rootCause && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Root Cause
                  </h3>
                  <p className="text-muted-foreground">{incident.rootCause}</p>
                </div>
              )}

              {/* Resolution */}
              {incident.resolution && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Resolution
                  </h3>
                  <p className="text-muted-foreground">{incident.resolution}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Incident Timeline</h3>
              {incident.timeline && incident.timeline.length > 0 ? (
                <div className="space-y-4">
                  {incident.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative">
                        <div className="w-3 h-3 bg-primary rounded-full mt-2" />
                        {idx < incident.timeline!.length - 1 && (
                          <div className="absolute left-1.5 top-5 w-0.5 h-12 bg-primary/30" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground text-sm">
                            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        {event.actionTaken && (
                          <p className="text-sm text-primary">Action: {event.actionTaken}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No timeline events recorded</p>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Affected Assets</h3>
              {incident.affectedAssets && incident.affectedAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {incident.affectedAssets.map((asset, idx) => (
                    <div key={idx} className="bg-background/50 rounded-lg p-4 border border-primary/10 flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium break-all">{asset}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No affected assets recorded</p>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Alerts</h3>
              {incident.relatedAlerts && incident.relatedAlerts.length > 0 ? (
                <div className="space-y-2">
                  {incident.relatedAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-background/50 rounded-lg p-3 border border-primary/10 flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm break-all">{alert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No related alerts</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-background/50 border-t border-primary/10 px-6 py-4 flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
