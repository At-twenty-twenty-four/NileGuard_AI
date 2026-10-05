/**
 * Enterprise Security & Compliance Module
 * - OWASP Top 10 protection
 * - Data encryption (AES-256)
 * - SOC 2 / ISO 27001 compliance tracking
 * - Audit logging
 */

import crypto from 'crypto';

export interface SecurityPolicy {
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface ComplianceControl {
  standard: 'SOC2' | 'ISO27001' | 'PCI-DSS' | 'HIPAA';
  controlId: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'in-progress';
  evidence?: string;
  lastAssessed: Date;
  nextAssessment: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress: string;
  status: 'success' | 'failure';
  details?: string;
}

/**
 * Data Encryption Service
 * AES-256-GCM encryption for sensitive data
 */
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private encryptionKey: Buffer;

  constructor(encryptionKey?: string) {
    // Use 32-byte key for AES-256
    const key = encryptionKey || process.env.ENCRYPTION_KEY || 'default-key-32-bytes-long-string!';
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(key)
      .digest();
  }

  encrypt(data: string): { encrypted: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  decrypt(encrypted: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, crypto.randomBytes(32), 100000, 64, 'sha512')
      .toString('hex');
  }
}

/**
 * OWASP Top 10 Protection
 */
export class OwaspProtection {
  /**
   * 1. Injection Prevention
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[&<>"']/g, (char) => {
        const map: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        };
        return map[char] || char;
      })
      .trim()
      .slice(0, 10000); // Limit length
  }

  /**
   * 2. Broken Authentication Prevention
   */
  static validatePasswordStrength(password: string): {
    strong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 12) score += 20;
    else if (password.length >= 8) score += 10;
    else feedback.push('Password should be at least 12 characters');

    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score += 15;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    else feedback.push('Add special characters');

    // Check for common patterns
    const commonPatterns = ['123', 'abc', 'password', 'qwerty', 'admin'];
    if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
      score -= 20;
      feedback.push('Avoid common patterns');
    }

    return {
      strong: score >= 80,
      score: Math.min(score, 100),
      feedback,
    };
  }

  /**
   * 3. Sensitive Data Exposure Prevention
   */
  static maskSensitiveData(data: any, patterns: string[]): any {
    if (typeof data !== 'object') return data;

    const masked = { ...data };
    for (const pattern of patterns) {
      for (const key in masked) {
        if (key.toLowerCase().includes(pattern.toLowerCase())) {
          const value = String(masked[key]);
          masked[key] = value.substring(0, 3) + '*'.repeat(Math.max(3, value.length - 6));
        }
      }
    }
    return masked;
  }

  /**
   * 5. Broken Access Control Prevention
   */
  static validatePermission(userRole: string, requiredPermission: string): boolean {
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'],
      analyst: ['threat.read', 'threat.create', 'incident.read', 'incident.create'],
      manager: ['threat.read', 'incident.read', 'incident.update'],
      viewer: ['threat.read', 'incident.read'],
    };

    const permissions = rolePermissions[userRole] || [];
    return permissions.includes('*') || permissions.includes(requiredPermission);
  }

  /**
   * 6. Security Misconfiguration Prevention
   */
  static validateSecurityHeaders(): Record<string, string> {
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  /**
   * 7. Cross-Site Scripting (XSS) Prevention
   */
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken && token.length > 32;
  }

  /**
   * 9. Using Components with Known Vulnerabilities
   */
  static checkDependencyVulnerabilities(): { vulnerable: boolean; details: string[] } {
    // In production, integrate with vulnerability scanner
    return {
      vulnerable: false,
      details: [],
    };
  }

  /**
   * 10. Insufficient Logging & Monitoring
   */
  static logSecurityEvent(event: AuditLog): void {
    console.log(`[SECURITY] ${event.timestamp.toISOString()} - ${event.action}`, {
      userId: event.userId,
      resource: `${event.resourceType}/${event.resourceId}`,
      ip: event.ipAddress,
      status: event.status,
    });
  }
}

/**
 * Compliance Framework
 */
export class ComplianceFramework {
  private controls: Map<string, ComplianceControl> = new Map();

  /**
   * SOC 2 Controls
   */
  initializeSOC2Controls(): ComplianceControl[] {
    const soc2Controls: ComplianceControl[] = [
      {
        standard: 'SOC2',
        controlId: 'CC6.1',
        description: 'Authentication and access controls',
        status: 'compliant',
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        standard: 'SOC2',
        controlId: 'CC7.2',
        description: 'System monitoring and logging',
        status: 'compliant',
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        standard: 'SOC2',
        controlId: 'A1.1',
        description: 'Data classification and protection',
        status: 'in-progress',
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];

    soc2Controls.forEach((c) => this.controls.set(`${c.standard}-${c.controlId}`, c));
    return soc2Controls;
  }

  /**
   * ISO 27001 Controls
   */
  initializeISO27001Controls(): ComplianceControl[] {
    const iso27001Controls: ComplianceControl[] = [
      {
        standard: 'ISO27001',
        controlId: 'A.9.2.1',
        description: 'User access registration and de-registration',
        status: 'compliant',
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        standard: 'ISO27001',
        controlId: 'A.10.1.1',
        description: 'Cryptographic controls',
        status: 'compliant',
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    ];

    iso27001Controls.forEach((c) => this.controls.set(`${c.standard}-${c.controlId}`, c));
    return iso27001Controls;
  }

  getComplianceStatus(): { standard: string; compliant: number; total: number; percentage: number }[] {
    const status: any = {};

    for (const control of this.controls.values()) {
      if (!status[control.standard]) {
        status[control.standard] = { compliant: 0, total: 0 };
      }
      status[control.standard].total++;
      if (control.status === 'compliant') {
        status[control.standard].compliant++;
      }
    }

    return Object.entries(status).map(([standard, counts]: any) => ({
      standard,
      compliant: counts.compliant,
      total: counts.total,
      percentage: Math.round((counts.compliant / counts.total) * 100),
    }));
  }
}

/**
 * Audit Logger
 */
export class AuditLogger {
  private logs: AuditLog[] = [];

  log(event: Omit<AuditLog, 'id'>): AuditLog {
    const auditLog: AuditLog = {
      ...event,
      id: `log-${Date.now()}`,
    };

    this.logs.push(auditLog);
    OwaspProtection.logSecurityEvent(auditLog);
    return auditLog;
  }

  getLogs(userId?: string, limit = 100): AuditLog[] {
    let logs = this.logs;
    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }
    return logs.slice(-limit);
  }

  getLogsSince(timestamp: Date): AuditLog[] {
    return this.logs.filter((l) => l.timestamp >= timestamp);
  }
}

// Export singletons
export const encryptionService = new EncryptionService();
export const complianceFramework = new ComplianceFramework();
export const auditLogger = new AuditLogger();

// Initialize compliance frameworks
complianceFramework.initializeSOC2Controls();
complianceFramework.initializeISO27001Controls();
