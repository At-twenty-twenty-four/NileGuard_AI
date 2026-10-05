'use client';

import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';

interface ThreatOverviewProps {
  locale: string;
}

const metrics = [
  {
    title: 'Active Threats',
    value: '24',
    change: '+12%',
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Detection Rate',
    value: '98.7%',
    change: '+2.1%',
    icon: Shield,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Blocked Threats',
    value: '156',
    change: '+8',
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'System Status',
    value: 'Optimal',
    change: '100% Online',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

export function ThreatOverview({ locale }: ThreatOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-green-500 mt-2">{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
