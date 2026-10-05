import { v4 as uuidv4 } from 'uuid';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceStatus {
  framework: 'ISO27001' | 'SOC2' | 'GDPR';
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAudit: string;
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'met' | 'partial' | 'not-met';
  dueDate?: string;
  evidence?: string;
}

// In-memory audit log (replace with database in production)
const auditLogs: AuditLog[] = [];

export class ComplianceManager {
  /**
   * Log user action for compliance and audit purposes
   */
  static logAction(
    userId: string,
    action: string,
    resource: string,
    status: 'success' | 'failure' = 'success',
    details: Record<string, any> = {}
  ): AuditLog {
    const log: AuditLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      status,
      details,
      ipAddress: typeof window === 'undefined' ? undefined : window.location.hostname,
      userAgent: typeof navigator === 'undefined' ? undefined : navigator.userAgent,
    };

    auditLogs.push(log);
    return log;
  }

  /**
   * Get audit logs for a specific resource
   */
  static getAuditLogs(resource?: string, days: number = 30): AuditLog[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return auditLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const matchesResource = !resource || log.resource === resource;
      const withinDateRange = logDate >= cutoffDate;
      return matchesResource && withinDateRange;
    });
  }

  /**
   * Get compliance status for ISO 27001
   */
  static getISO27001Status(): ComplianceStatus {
    return {
      framework: 'ISO27001',
      status: 'partial',
      lastAudit: new Date().toISOString(),
      requirements: [
        {
          id: 'a.5.1',
          name: 'Information Security Policies',
          description: 'Management directives and support for information security',
          status: 'met',
        },
        {
          id: 'a.6.1',
          name: 'Organization of Information Security',
          description: 'Manage information security within the organization',
          status: 'met',
        },
        {
          id: 'a.7.1',
          name: 'Human Resource Security',
          description: 'Ensure people fulfill their security responsibilities',
          status: 'partial',
        },
        {
          id: 'a.8.1',
          name: 'Asset Management',
          description: 'Protect and maintain information assets',
          status: 'met',
        },
        {
          id: 'a.9.1',
          name: 'Access Control',
          description: 'Limit access to information and systems',
          status: 'met',
        },
        {
          id: 'a.10.1',
          name: 'Cryptography',
          description: 'Protect information with cryptographic techniques',
          status: 'met',
        },
        {
          id: 'a.11.1',
          name: 'Physical and Environmental Security',
          description: 'Prevent unauthorized physical access',
          status: 'partial',
        },
        {
          id: 'a.12.1',
          name: 'Operations Security',
          description: 'Ensure correct and secure operations',
          status: 'met',
        },
        {
          id: 'a.13.1',
          name: 'Communications Security',
          description: 'Protect information in transit',
          status: 'met',
        },
        {
          id: 'a.14.1',
          name: 'System Acquisition Development & Maintenance',
          description: 'Secure systems throughout their lifecycle',
          status: 'met',
        },
        {
          id: 'a.15.1',
          name: 'Supplier Relationships',
          description: 'Manage security of supplier relationships',
          status: 'partial',
        },
        {
          id: 'a.16.1',
          name: 'Information Security Incident Management',
          description: 'Respond effectively to security incidents',
          status: 'met',
        },
      ],
    };
  }

  /**
   * Check if action violates security policy
   */
  static validateSecurityPolicy(
    userId: string,
    action: string,
    resource: string
  ): { allowed: boolean; reason?: string } {
    // Example security policies
    const restrictedActions = ['delete_audit_logs', 'modify_compliance_settings'];
    const requiredRoles = ['admin', 'security_officer'];

    if (restrictedActions.includes(action)) {
      return {
        allowed: false,
        reason: `Action "${action}" requires additional authorization`,
      };
    }

    return { allowed: true };
  }

  /**
   * Generate compliance report
   */
  static generateComplianceReport(days: number = 30): {
    generatedAt: string;
    period: string;
    totalActions: number;
    successfulActions: number;
    failedActions: number;
    complianceScore: number;
    auditLogs: AuditLog[];
  } {
    const logs = this.getAuditLogs(undefined, days);
    const successful = logs.filter((l) => l.status === 'success').length;
    const failed = logs.filter((l) => l.status === 'failure').length;
    const complianceScore = logs.length > 0 ? (successful / logs.length) * 100 : 100;

    return {
      generatedAt: new Date().toISOString(),
      period: `Last ${days} days`,
      totalActions: logs.length,
      successfulActions: successful,
      failedActions: failed,
      complianceScore: Math.round(complianceScore),
      auditLogs: logs,
    };
  }
}
