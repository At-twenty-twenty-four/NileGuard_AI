'use client';

import { AlertCircle, Clock, MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecentAlertsProps {
  locale: string;
}

const alerts = [
  {
    id: 1,
    type: 'Intrusion Detection',
    severity: 'critical',
    source: '192.168.1.105',
    actor: 'APT-33',
    timestamp: '2 minutes ago',
    confidence: 98,
  },
  {
    id: 2,
    type: 'Malware Detected',
    severity: 'high',
    source: '10.0.0.42',
    actor: 'Lazarus',
    timestamp: '15 minutes ago',
    confidence: 94,
  },
  {
    id: 3,
    type: 'Phishing Email',
    severity: 'medium',
    source: 'attacker@fake-domain.com',
    actor: 'Unknown',
    timestamp: '1 hour ago',
    confidence: 87,
  },
  {
    id: 4,
    type: 'DDoS Attack',
    severity: 'high',
    source: 'Multiple ASNs',
    actor: 'Mirai Botnet',
    timestamp: '3 hours ago',
    confidence: 92,
  },
];

export function RecentAlerts({ locale }: RecentAlertsProps) {
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

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Alerts</h3>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{alert.type}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {alert.source}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{alert.actor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp}
                </div>
                <Badge className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                  {alert.confidence}% AI Confidence
                </Badge>
              </div>
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
