'use client';

import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { performanceMonitor, WebVital, PerformanceMetric } from '@/lib/performance-monitor';

interface PerformanceStats {
  metrics: PerformanceMetric[];
  webVitals: WebVital[];
  summary: {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetric | null;
    fastestMetric: PerformanceMetric | null;
  };
}

export function PerformanceDashboard() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);

  useEffect(() => {
    const loadStats = () => {
      const report = performanceMonitor.generateReport();
      setStats({
        metrics: report.metrics,
        webVitals: report.webVitals,
        summary: report.summary,
      });
    };

    // Initial load
    loadStats();

    // Update every 5 seconds
    const interval = setInterval(loadStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">Loading performance metrics...</p>
      </div>
    );
  }

  const getRatingIcon = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getRatingColor = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return 'bg-green-500/10 text-green-700';
      case 'needs-improvement':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'poor':
        return 'bg-red-500/10 text-red-700';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Metrics
        </h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground mb-1">Total Metrics</p>
          <p className="text-2xl font-bold">{stats.summary.totalMetrics}</p>
        </div>

        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
          <p className="text-2xl font-bold">
            {stats.summary.averageDuration.toFixed(0)}
            <span className="text-sm">ms</span>
          </p>
        </div>

        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Slowest Metric</p>
          <p className="text-2xl font-bold">
            {stats.summary.slowestMetric?.duration.toFixed(0) || 'N/A'}
            <span className="text-sm">ms</span>
          </p>
          {stats.summary.slowestMetric && (
            <p className="text-xs text-muted-foreground mt-1">{stats.summary.slowestMetric.name}</p>
          )}
        </div>

        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Fastest Metric</p>
          <p className="text-2xl font-bold">
            {stats.summary.fastestMetric?.duration.toFixed(0) || 'N/A'}
            <span className="text-sm">ms</span>
          </p>
          {stats.summary.fastestMetric && (
            <p className="text-xs text-muted-foreground mt-1">{stats.summary.fastestMetric.name}</p>
          )}
        </div>
      </div>

      {/* Web Vitals */}
      {stats.webVitals.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Web Vitals
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.webVitals.map((vital) => (
              <div key={vital.name} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{vital.name}</p>
                    <p className="text-lg font-bold mt-1">{vital.value.toFixed(0)}ms</p>
                  </div>
                  <div>{getRatingIcon(vital.rating)}</div>
                </div>
                <Badge className={`mt-2 ${getRatingColor(vital.rating)}`}>
                  {vital.rating.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Metrics */}
      {stats.metrics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3">Recent Measurements</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.metrics.slice(-5).map((metric) => (
              <div key={metric.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(metric.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{metric.duration.toFixed(0)}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
