'use client';

import { CheckCircle2, AlertCircle, Clock, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { iso27001Manager } from '@/lib/iso27001-compliance';
import { useEffect, useState } from 'react';

export function ComplianceStatus() {
  const [overallCompliance, setOverallCompliance] = useState(0);
  const [controls, setControls] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load ISO 27001 compliance data
    setOverallCompliance(iso27001Manager.getOverallCompliance());
    setControls(iso27001Manager.getAllControls());
    setAuditLogs(iso27001Manager.getAuditLogs(10));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'planned':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'partial':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'planned':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default:
        return 'bg-red-500/10 text-red-700 border-red-200';
    }
  };

  const implementedCount = controls.filter((c) => c.status === 'implemented').length;
  const partialCount = controls.filter((c) => c.status === 'partial').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          ISO 27001:2022 Compliance Status
        </h3>
        <p className="text-sm text-muted-foreground">
          Information Security Management System compliance tracking
        </p>
      </div>

      {/* Overall Compliance */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Compliance</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{overallCompliance}%</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{implementedCount}</p>
            <p className="text-xs text-muted-foreground">Controls Implemented</p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallCompliance}%` }}
          />
        </div>
      </div>

      {/* Control Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-green-200 rounded-lg p-4 bg-green-500/5">
          <p className="text-2xl font-bold text-green-700">{implementedCount}</p>
          <p className="text-xs text-muted-foreground">Implemented</p>
        </div>
        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-500/5">
          <p className="text-2xl font-bold text-yellow-700">{partialCount}</p>
          <p className="text-xs text-muted-foreground">Partial</p>
        </div>
        <div className="border border-red-200 rounded-lg p-4 bg-red-500/5">
          <p className="text-2xl font-bold text-red-700">{controls.filter((c) => c.status === 'not-started').length}</p>
          <p className="text-xs text-muted-foreground">Not Started</p>
        </div>
      </div>

      {/* Key Controls */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          ISO 27001 Control Domains (10 shown)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {controls.slice(0, 10).map((control) => (
            <div
              key={control.id}
              className={`border rounded-lg p-4 ${getStatusColor(control.status)}`}
            >
              <div className="flex items-start gap-2 mb-2">
                {getStatusIcon(control.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{control.code}</p>
                  <p className="text-xs font-medium">{control.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{control.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium">{control.percentage}% Complete</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {control.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Audit Activity */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Recent Audit Activity</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {auditLogs.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Action</th>
                    <th className="px-4 py-2 text-left font-medium">Resource</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-border hover:bg-muted/50 transition"
                    >
                      <td className="px-4 py-2 text-xs">{log.action}</td>
                      <td className="px-4 py-2 text-xs">{log.resource}</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={log.status === 'success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No audit logs yet. Start by logging security actions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
