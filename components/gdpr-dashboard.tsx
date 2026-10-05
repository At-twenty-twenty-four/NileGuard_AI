'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Clock, Users, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { gdprManager } from '@/lib/gdpr-compliance';

interface GDPRDashboardProps {
  title?: string;
}

export function GDPRDashboard({ title = 'GDPR Data Privacy Dashboard' }: GDPRDashboardProps) {
  const [complianceStatus, setComplianceStatus] = useState<any>(null);
  const [dataProcessings, setDataProcessings] = useState<any[]>([]);
  const [breaches, setBreaches] = useState<any[]>([]);

  useEffect(() => {
    const status = gdprManager.getComplianceStatus();
    const processings = gdprManager.getDataProcessings();
    const breachNotifs = gdprManager.getBreachNotifications();

    setComplianceStatus(status);
    setDataProcessings(processings);
    setBreaches(breachNotifs);
  }, []);

  if (!complianceStatus) return null;

  const complianceScore = Math.round(
    ((complianceStatus.totalProcessings > 0 ? complianceStatus.withDPIA / complianceStatus.totalProcessings : 0) * 40 +
      (complianceStatus.withValidConsent > 0 ? 1 : 0) * 30 +
      (complianceStatus.breachesReported === 0 ? 30 : 0)) /
      100 *
      100
  );

  const riskLevel =
    breaches.length > 0
      ? breaches.some((b) => b.severity === 'critical')
        ? 'critical'
        : 'high'
      : 'low';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage data privacy controls and ensure GDPR compliance
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
              <div className="text-3xl font-bold">{complianceScore}%</div>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
              <div className="text-3xl font-bold capitalize text-orange-600">{riskLevel}</div>
            </div>
            {riskLevel === 'critical' ? (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {breaches.length > 0 ? `${breaches.length} incident(s) reported` : 'No breaches reported'}
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Data Subjects</p>
              <div className="text-3xl font-bold">{complianceStatus.dataSubjectsCount}</div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-muted-foreground">
            {complianceStatus.withValidConsent} with valid consent
          </p>
        </div>
      </div>

      {/* Data Processing Activities */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Processing Activities (Registered {dataProcessings.length})
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {dataProcessings.map((proc) => (
            <div key={proc.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{proc.name}</p>
                  <p className="text-xs text-muted-foreground">{proc.purpose}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize ${
                    proc.status === 'active'
                      ? 'border-green-200 text-green-700'
                      : 'border-red-200 text-red-700'
                  }`}
                >
                  {proc.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Legal Basis: </span>
                  <span className="font-medium capitalize">{proc.legalBasis.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Retention: </span>
                  <span className="font-medium">{proc.retentionPeriod} days</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {proc.dataCategory.map((cat: string) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Rights Implementation */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Data Rights Implementation Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { right: 'Right to Access', status: 'implemented' },
            { right: 'Right to Erasure', status: 'implemented' },
            { right: 'Right to Rectification', status: 'implemented' },
            { right: 'Right to Data Portability', status: 'implemented' },
            { right: 'Right to Restrict Processing', status: 'implemented' },
            { right: 'Right to Object', status: 'planned' },
          ].map((item) => (
            <div
              key={item.right}
              className={`border rounded-lg p-3 flex items-center justify-between ${
                item.status === 'implemented'
                  ? 'border-green-200 bg-green-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <span className="text-sm font-medium">{item.right}</span>
              <Badge
                className={`capitalize text-xs ${
                  item.status === 'implemented'
                    ? 'bg-green-600'
                    : 'bg-yellow-600'
                }`}
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Data Breaches & Incidents */}
      {breaches.length > 0 && (
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-4 h-4" />
            Data Breach Notifications ({breaches.length})
          </h4>
          <div className="space-y-3">
            {breaches.map((breach) => (
              <div key={breach.id} className="border border-red-200 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-red-900">
                      {breach.affectedDataSubjects} data subjects affected
                    </p>
                    <p className="text-xs text-red-700">
                      Breach Date: {new Date(breach.breachDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={`capitalize text-xs ${
                      breach.severity === 'critical'
                        ? 'bg-red-600'
                        : breach.severity === 'high'
                          ? 'bg-orange-600'
                          : 'bg-yellow-600'
                    }`}
                  >
                    {breach.severity}
                  </Badge>
                </div>

                <div className="mb-2">
                  <p className="text-xs font-medium text-red-900 mb-1">Affected Data Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {breach.dataCategories.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs border-red-200">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-red-200">
                  <span className="text-xs">
                    Status:{' '}
                    <span className="font-medium capitalize">{breach.remediationStatus}</span>
                  </span>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                    <Clock className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="border border-border rounded-lg p-6 bg-muted/50">
        <h4 className="font-semibold mb-4">GDPR Compliance Recommendations</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Maintain Data Processing Records (ROPA) - {dataProcessings.length} activities tracked</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Implement Data Protection by Design and Default</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Conduct Data Protection Impact Assessments (DPIA) for high-risk processing</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Ensure Data Subject Rights are easily exercisable</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Establish incident response and breach notification procedures</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
