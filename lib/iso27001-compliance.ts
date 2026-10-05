/**
 * ISO 27001:2022 Information Security Management System (ISMS)
 * Implementation for EthioShield - Cyber Threat Intelligence Platform
 */

import { v4 as uuidv4 } from 'uuid';

export interface ComplianceControl {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'implemented' | 'partial' | 'planned' | 'not-started';
  percentage: number;
  evidence: string[];
  lastAudit: Date;
  nextAudit: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  overallCompliance: number;
  controlStatus: Record<string, ComplianceControl>;
  auditLogs: AuditLog[];
  findings: string[];
  recommendations: string[];
}

const ISO27001_CONTROLS: Record<string, ComplianceControl> = {
  A51: {
    id: 'A51',
    code: 'A.5.1',
    title: 'Policies for Information Security',
    description: 'Establish and communicate information security policies',
    status: 'implemented',
    percentage: 100,
    evidence: ['policy-doc-001', 'training-record-001'],
    lastAudit: new Date('2024-06-01'),
    nextAudit: new Date('2024-12-01'),
  },
  A52: {
    id: 'A52',
    code: 'A.5.2',
    title: 'Information Security Roles and Responsibilities',
    description: 'Establish clear roles and responsibilities for information security',
    status: 'implemented',
    percentage: 100,
    evidence: ['org-chart-001', 'role-definition-001'],
    lastAudit: new Date('2024-06-01'),
    nextAudit: new Date('2024-12-01'),
  },
  A63: {
    id: 'A63',
    code: 'A.6.3',
    title: 'Segregation of Duties',
    description: 'Implement segregation of duties to prevent conflicts of interest',
    status: 'partial',
    percentage: 75,
    evidence: ['access-control-001', 'workflow-001'],
    lastAudit: new Date('2024-05-15'),
    nextAudit: new Date('2024-11-15'),
  },
  A71: {
    id: 'A71',
    code: 'A.7.1',
    title: 'Authentication',
    description: 'Implement strong authentication mechanisms',
    status: 'implemented',
    percentage: 100,
    evidence: ['auth-system-001', 'mfa-config-001'],
    lastAudit: new Date('2024-06-10'),
    nextAudit: new Date('2024-12-10'),
  },
  A72: {
    id: 'A72',
    code: 'A.7.2',
    title: 'Access Control',
    description: 'Grant access rights on a need-to-know basis',
    status: 'implemented',
    percentage: 100,
    evidence: ['rbac-config-001', 'access-review-001'],
    lastAudit: new Date('2024-06-10'),
    nextAudit: new Date('2024-12-10'),
  },
  A81: {
    id: 'A81',
    code: 'A.8.1',
    title: 'Cryptography',
    description: 'Protect information using cryptographic controls',
    status: 'implemented',
    percentage: 100,
    evidence: ['encryption-policy-001', 'tls-config-001'],
    lastAudit: new Date('2024-06-05'),
    nextAudit: new Date('2024-12-05'),
  },
  A101: {
    id: 'A101',
    code: 'A.10.1',
    title: 'Information and Other Assets',
    description: 'Maintain accurate inventory of information assets',
    status: 'partial',
    percentage: 80,
    evidence: ['asset-inventory-001', 'classification-001'],
    lastAudit: new Date('2024-05-20'),
    nextAudit: new Date('2024-11-20'),
  },
  A121: {
    id: 'A121',
    code: 'A.12.1',
    title: 'Event Logging',
    description: 'Log user activities and security events',
    status: 'implemented',
    percentage: 100,
    evidence: ['logging-system-001', 'audit-trail-001'],
    lastAudit: new Date('2024-06-08'),
    nextAudit: new Date('2024-12-08'),
  },
  A122: {
    id: 'A122',
    code: 'A.12.2',
    title: 'Monitoring of Information Systems',
    description: 'Monitor systems for anomalies and security events',
    status: 'implemented',
    percentage: 100,
    evidence: ['monitoring-tool-001', 'alert-config-001'],
    lastAudit: new Date('2024-06-08'),
    nextAudit: new Date('2024-12-08'),
  },
  A141: {
    id: 'A141',
    code: 'A.14.1',
    title: 'Information Security Requirements in Development',
    description: 'Implement security requirements in software development',
    status: 'partial',
    percentage: 70,
    evidence: ['sdlc-policy-001', 'code-review-001'],
    lastAudit: new Date('2024-05-25'),
    nextAudit: new Date('2024-11-25'),
  },
};

class ISO27001Manager {
  private auditLogs: AuditLog[] = [];
  private controls: Record<string, ComplianceControl> = { ...ISO27001_CONTROLS };

  /**
   * Log an action for audit trail
   */
  logAction(userId: string, action: string, resource: string, status: 'success' | 'failure' = 'success', details: string = ''): AuditLog {
    const log: AuditLog = {
      id: uuidv4(),
      timestamp: new Date(),
      userId,
      action,
      resource,
      status,
      details,
      ipAddress: typeof window !== 'undefined' ? window.location.hostname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.auditLogs.push(log);
    
    // Keep only last 10,000 logs in memory
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }

    return log;
  }

  /**
   * Get all audit logs
   */
  getAuditLogs(limit: number = 100): AuditLog[] {
    return this.auditLogs.slice(-limit).reverse();
  }

  /**
   * Get audit logs for a specific resource
   */
  getAuditLogsForResource(resource: string, days: number = 30): AuditLog[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.auditLogs.filter(
      (log) => log.resource === resource && log.timestamp >= cutoffDate
    );
  }

  /**
   * Get ISO 27001 control status
   */
  getControl(controlId: string): ComplianceControl | undefined {
    return this.controls[controlId];
  }

  /**
   * Get all controls
   */
  getAllControls(): ComplianceControl[] {
    return Object.values(this.controls);
  }

  /**
   * Update control status
   */
  updateControl(controlId: string, updates: Partial<ComplianceControl>): ComplianceControl {
    if (!this.controls[controlId]) {
      throw new Error(`Control ${controlId} not found`);
    }

    this.controls[controlId] = {
      ...this.controls[controlId],
      ...updates,
      lastAudit: new Date(),
    };

    return this.controls[controlId];
  }

  /**
   * Calculate overall compliance percentage
   */
  getOverallCompliance(): number {
    const controls = Object.values(this.controls);
    if (controls.length === 0) return 0;

    const totalPercentage = controls.reduce((sum, control) => sum + control.percentage, 0);
    return Math.round(totalPercentage / controls.length);
  }

  /**
   * Get compliance by domain
   */
  getComplianceByDomain(): Record<string, { count: number; compliant: number; percentage: number }> {
    const domains: Record<string, { count: number; compliant: number; percentage: number }> = {};

    Object.values(this.controls).forEach((control) => {
      const domain = control.code.split('.')[0]; // Extract 'A' from 'A.5.1'

      if (!domains[domain]) {
        domains[domain] = { count: 0, compliant: 0, percentage: 0 };
      }

      domains[domain].count += 1;
      if (control.status === 'implemented') {
        domains[domain].compliant += 1;
      }

      domains[domain].percentage = Math.round((domains[domain].compliant / domains[domain].count) * 100);
    });

    return domains;
  }

  /**
   * Generate compliance report
   */
  generateReport(days: number = 30): ComplianceReport {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    const relevantLogs = this.auditLogs.filter((log) => log.timestamp >= startDate);
    const failedLogs = relevantLogs.filter((log) => log.status === 'failure');

    const findings: string[] = [];
    const recommendations: string[] = [];

    // Generate findings and recommendations
    Object.values(this.controls).forEach((control) => {
      if (control.status === 'partial') {
        findings.push(`Control ${control.code} is only partially implemented (${control.percentage}%)`);
        recommendations.push(`Complete implementation of ${control.code}: ${control.title}`);
      } else if (control.status === 'planned') {
        recommendations.push(`Plan implementation of ${control.code}: ${control.title}`);
      }
    });

    if (failedLogs.length > 0) {
      findings.push(`${failedLogs.length} failed audit events detected in the past ${days} days`);
      recommendations.push('Review and investigate failed audit events');
    }

    return {
      id: uuidv4(),
      generatedAt: now,
      period: { start: startDate, end: now },
      overallCompliance: this.getOverallCompliance(),
      controlStatus: this.controls,
      auditLogs: relevantLogs,
      findings,
      recommendations,
    };
  }

  /**
   * Export audit logs as CSV
   */
  exportAuditLogsAsCSV(): string {
    const headers = ['Timestamp', 'User ID', 'Action', 'Resource', 'Status', 'Details', 'IP Address'];
    const rows = this.auditLogs.map((log) => [
      log.timestamp.toISOString(),
      log.userId,
      log.action,
      log.resource,
      log.status,
      log.details,
      log.ipAddress || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    return csv;
  }
}

export const iso27001Manager = new ISO27001Manager();
