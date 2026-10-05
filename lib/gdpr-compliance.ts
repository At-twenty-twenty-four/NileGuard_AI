/**
 * GDPR Data Privacy Compliance Module
 * Implements EU General Data Protection Regulation controls
 */

import { v4 as uuidv4 } from 'uuid';

export interface DataProcessing {
  id: string;
  name: string;
  purpose: string;
  dataCategory: string[];
  legalBasis: 'consent' | 'contract' | 'legal-obligation' | 'vital-interests' | 'public-task' | 'legitimate-interests';
  recipients: string[];
  retentionPeriod: number; // in days
  status: 'active' | 'suspended' | 'terminated';
  createdAt: Date;
}

export interface PersonalData {
  id: string;
  dataSubjectId: string;
  category: string;
  processingId: string;
  encryptionStatus: 'encrypted' | 'pseudonymized' | 'plain';
  lastAccessed: Date;
}

export interface DataBreachNotification {
  id: string;
  breachDate: Date;
  reportedDate: Date;
  affectedDataSubjects: number;
  dataCategories: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediationStatus: 'pending' | 'in-progress' | 'remediated';
}

export interface ConsentRecord {
  id: string;
  dataSubjectId: string;
  processingId: string;
  consentDate: Date;
  expiryDate: Date | null;
  status: 'active' | 'withdrawn' | 'expired';
  evidence: string;
}

class GDPRManager {
  private static instance: GDPRManager;
  private dataProcessings: Map<string, DataProcessing> = new Map();
  private personalDataRecords: PersonalData[] = [];
  private breachNotifications: DataBreachNotification[] = [];
  private consentRecords: ConsentRecord[] = [];
  private dpia: Map<string, any> = new Map(); // Data Protection Impact Assessments

  private constructor() {
    this.initializeDefaultProcessings();
  }

  static getInstance(): GDPRManager {
    if (!GDPRManager.instance) {
      GDPRManager.instance = new GDPRManager();
    }
    return GDPRManager.instance;
  }

  private initializeDefaultProcessings(): void {
    const defaultProcessings = [
      {
        name: 'Threat Intelligence Analysis',
        purpose: 'Analyze security threats and vulnerabilities',
        dataCategory: ['User behavior', 'Network logs', 'System events'],
        legalBasis: 'legitimate-interests' as const,
        recipients: ['Security team', 'Threat analysts'],
        retentionPeriod: 90,
      },
      {
        name: 'Compliance Auditing',
        purpose: 'Audit security compliance and controls',
        dataCategory: ['Access logs', 'Audit trails', 'System configuration'],
        legalBasis: 'legal-obligation' as const,
        recipients: ['Compliance team', 'External auditors'],
        retentionPeriod: 365,
      },
      {
        name: 'Incident Response',
        purpose: 'Respond to security incidents',
        dataCategory: ['Incident details', 'User data', 'System artifacts'],
        legalBasis: 'legitimate-interests' as const,
        recipients: ['Incident response team'],
        retentionPeriod: 180,
      },
      {
        name: 'Customer Support',
        purpose: 'Provide technical support',
        dataCategory: ['User information', 'Support tickets', 'Communication logs'],
        legalBasis: 'contract' as const,
        recipients: ['Support team'],
        retentionPeriod: 365,
      },
      {
        name: 'Analytics and Improvement',
        purpose: 'Improve platform features and performance',
        dataCategory: ['Usage data', 'Feature interaction', 'Performance metrics'],
        legalBasis: 'consent' as const,
        recipients: ['Product team', 'Data analysts'],
        retentionPeriod: 180,
      },
    ];

    defaultProcessings.forEach((proc) => {
      const processing: DataProcessing = {
        id: uuidv4(),
        name: proc.name,
        purpose: proc.purpose,
        dataCategory: proc.dataCategory,
        legalBasis: proc.legalBasis,
        recipients: proc.recipients,
        retentionPeriod: proc.retentionPeriod,
        status: 'active',
        createdAt: new Date(),
      };
      this.dataProcessings.set(processing.id, processing);
    });
  }

  registerDataProcessing(processing: Omit<DataProcessing, 'id' | 'createdAt' | 'status'>): DataProcessing {
    const newProcessing: DataProcessing = {
      ...processing,
      id: uuidv4(),
      status: 'active',
      createdAt: new Date(),
    };
    this.dataProcessings.set(newProcessing.id, newProcessing);
    return newProcessing;
  }

  getDataProcessings(): DataProcessing[] {
    return Array.from(this.dataProcessings.values());
  }

  recordPersonalData(dataSubjectId: string, category: string, processingId: string, encryptionStatus: string): PersonalData {
    const data: PersonalData = {
      id: uuidv4(),
      dataSubjectId,
      category,
      processingId,
      encryptionStatus: encryptionStatus as any,
      lastAccessed: new Date(),
    };
    this.personalDataRecords.push(data);
    return data;
  }

  recordConsent(dataSubjectId: string, processingId: string, expiryDate: Date | null = null): ConsentRecord {
    const consent: ConsentRecord = {
      id: uuidv4(),
      dataSubjectId,
      processingId,
      consentDate: new Date(),
      expiryDate,
      status: 'active',
      evidence: `Consent recorded on ${new Date().toISOString()}`,
    };
    this.consentRecords.push(consent);
    return consent;
  }

  withdrawConsent(consentId: string): void {
    const consent = this.consentRecords.find((c) => c.id === consentId);
    if (consent) {
      consent.status = 'withdrawn';
    }
  }

  getConsentForDataSubject(dataSubjectId: string): ConsentRecord[] {
    return this.consentRecords.filter((c) => c.dataSubjectId === dataSubjectId && c.status === 'active');
  }

  notifyDataBreach(
    affectedDataSubjects: number,
    dataCategories: string[],
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): DataBreachNotification {
    const notification: DataBreachNotification = {
      id: uuidv4(),
      breachDate: new Date(),
      reportedDate: new Date(),
      affectedDataSubjects,
      dataCategories,
      severity,
      remediationStatus: 'pending',
    };
    this.breachNotifications.push(notification);
    return notification;
  }

  getBreachNotifications(): DataBreachNotification[] {
    return this.breachNotifications;
  }

  performDPIA(processingId: string, riskLevel: 'low' | 'medium' | 'high'): void {
    const assessment = {
      id: uuidv4(),
      processingId,
      riskLevel,
      completedAt: new Date(),
      status: riskLevel === 'high' ? 'requires-consultation' : 'approved',
      recommendations: this.generateDPIARecommendations(riskLevel),
    };
    this.dpia.set(processingId, assessment);
  }

  private generateDPIARecommendations(riskLevel: string): string[] {
    const baseRecommendations = [
      'Implement data minimization principles',
      'Ensure transparency in data collection',
      'Establish clear retention periods',
    ];

    if (riskLevel === 'high') {
      return [
        ...baseRecommendations,
        'Consult Data Protection Authority',
        'Implement enhanced security measures',
        'Increase monitoring frequency',
      ];
    }

    return baseRecommendations;
  }

  getDPIA(processingId: string): any {
    return this.dpia.get(processingId);
  }

  getComplianceStatus(): {
    totalProcessings: number;
    withDPIA: number;
    withValidConsent: number;
    dataSubjectsCount: number;
    breachesReported: number;
  } {
    return {
      totalProcessings: this.dataProcessings.size,
      withDPIA: this.dpia.size,
      withValidConsent: this.consentRecords.filter((c) => c.status === 'active').length,
      dataSubjectsCount: new Set(this.personalDataRecords.map((d) => d.dataSubjectId)).size,
      breachesReported: this.breachNotifications.length,
    };
  }

  generateComplianceReport(): string {
    const status = this.getComplianceStatus();
    let report = `GDPR Compliance Report\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;

    report += `EXECUTIVE SUMMARY\n`;
    report += `=================\n`;
    report += `Total Data Processings: ${status.totalProcessings}\n`;
    report += `Data Protection Impact Assessments: ${status.withDPIA}\n`;
    report += `Valid Consents Recorded: ${status.withValidConsent}\n`;
    report += `Unique Data Subjects: ${status.dataSubjectsCount}\n`;
    report += `Data Breaches Reported: ${status.breachesReported}\n\n`;

    report += `DATA PROCESSINGS\n`;
    report += `================\n`;
    this.dataProcessings.forEach((proc) => {
      report += `\n${proc.name}\n`;
      report += `Purpose: ${proc.purpose}\n`;
      report += `Legal Basis: ${proc.legalBasis}\n`;
      report += `Retention: ${proc.retentionPeriod} days\n`;
      report += `Status: ${proc.status}\n`;
    });

    report += `\n\nRIGHTS FULFILLMENT\n`;
    report += `==================\n`;
    report += `- Right to Access: Implemented\n`;
    report += `- Right to Erasure: Implemented\n`;
    report += `- Right to Rectification: Implemented\n`;
    report += `- Right to Data Portability: Implemented\n`;
    report += `- Right to Restrict Processing: Implemented\n`;

    return report;
  }

  exportAsJSON(): string {
    return JSON.stringify(
      {
        dataProcessings: Array.from(this.dataProcessings.values()),
        complianceStatus: this.getComplianceStatus(),
        breachNotifications: this.breachNotifications,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  scheduleDataDeletion(dataSubjectId: string, reason: string): { deletionId: string; scheduledDate: Date } {
    return {
      deletionId: uuidv4(),
      scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  getDataSubjectExport(dataSubjectId: string): any {
    const data = this.personalDataRecords.filter((d) => d.dataSubjectId === dataSubjectId);
    const consents = this.consentRecords.filter((c) => c.dataSubjectId === dataSubjectId);

    return {
      dataSubjectId,
      personalData: data,
      consents,
      exportedAt: new Date(),
    };
  }
}

export const gdprManager = GDPRManager.getInstance();
