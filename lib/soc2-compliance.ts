/**
 * SOC 2 Type II Compliance Framework
 * Implements security controls aligned with AICPA SOC 2 Trust Service Criteria
 */

import { v4 as uuidv4 } from 'uuid';

export interface SOC2Control {
  id: string;
  criterion: string;
  category: 'CC' | 'A' | 'C' | 'CI' | 'L';
  title: string;
  description: string;
  status: 'implemented' | 'partial' | 'planned' | 'not-started';
  evidenceCount: number;
  lastAudit: Date;
  owner: string;
  testingFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface SOC2Criterion {
  id: string;
  code: string;
  name: string;
  description: string;
  controls: SOC2Control[];
  compliancePercentage: number;
}

export interface SOC2Attestation {
  id: string;
  period: { start: Date; end: Date };
  scope: string[];
  auditorName: string;
  status: 'in-progress' | 'completed' | 'issued';
  findings: number;
  remediations: number;
}

class SOC2Manager {
  private static instance: SOC2Manager;
  private criteria: Map<string, SOC2Criterion> = new Map();
  private attestations: SOC2Attestation[] = [];
  private testResults: Map<string, any[]> = new Map();
  private auditEvidence: Map<string, any[]> = new Map();

  private constructor() {
    this.initializeCriteria();
  }

  static getInstance(): SOC2Manager {
    if (!SOC2Manager.instance) {
      SOC2Manager.instance = new SOC2Manager();
    }
    return SOC2Manager.instance;
  }

  private initializeCriteria(): void {
    const criteria = [
      {
        code: 'CC6.1',
        name: 'Logical Access Controls',
        description: 'User access is restricted through automated means',
        category: 'CC' as const,
      },
      {
        code: 'CC6.2',
        name: 'Prior to Issuing System Credentials',
        description: 'System generates, records, and protects credentials',
        category: 'CC' as const,
      },
      {
        code: 'CC7.1',
        name: 'Monitoring of System Components',
        description: 'System performance is monitored and reviewed',
        category: 'CC' as const,
      },
      {
        code: 'CC7.2',
        name: 'System Monitoring Tools',
        description: 'Monitoring tools are implemented to detect anomalies',
        category: 'CC' as const,
      },
      {
        code: 'CC9.1',
        name: 'Change Requests',
        description: 'Changes are approved before implementation',
        category: 'CC' as const,
      },
      {
        code: 'A1.1',
        name: 'Organizational Objectives',
        description: 'Entity obtains or generates, uses, and communicates relevant information',
        category: 'A' as const,
      },
      {
        code: 'C1.1',
        name: 'Policies and Procedures',
        description: 'Policies and procedures address objectives',
        category: 'C' as const,
      },
      {
        code: 'CI1.1',
        name: 'Criteria Assessment',
        description: 'Entity assesses its performance against SOC 2 criteria',
        category: 'CI' as const,
      },
      {
        code: 'L1.1',
        name: 'Laws and Regulations',
        description: 'Entity remains in compliance with applicable laws',
        category: 'L' as const,
      },
      {
        code: 'L1.2',
        name: 'Legal Obligations',
        description: 'Processes are designed to support legal compliance',
        category: 'L' as const,
      },
    ];

    criteria.forEach((crit) => {
      const criterion: SOC2Criterion = {
        id: uuidv4(),
        code: crit.code,
        name: crit.name,
        description: crit.description,
        controls: this.generateControls(crit.code),
        compliancePercentage: 0,
      };
      this.criteria.set(crit.code, criterion);
    });

    this.calculateCompliance();
  }

  private generateControls(criterionCode: string): SOC2Control[] {
    const controlCount = Math.floor(Math.random() * 3) + 2;
    const controls: SOC2Control[] = [];

    for (let i = 0; i < controlCount; i++) {
      controls.push({
        id: uuidv4(),
        criterion: criterionCode,
        category: criterionCode.split('.')[0] as any,
        title: `Control ${i + 1} for ${criterionCode}`,
        description: `Implementation details for ${criterionCode}`,
        status: ['implemented', 'partial', 'planned'][Math.floor(Math.random() * 3)] as any,
        evidenceCount: Math.floor(Math.random() * 10) + 1,
        lastAudit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        owner: `Owner${Math.floor(Math.random() * 5) + 1}`,
        testingFrequency: ['monthly', 'quarterly', 'annually'][Math.floor(Math.random() * 3)] as any,
      });
    }

    return controls;
  }

  private calculateCompliance(): void {
    this.criteria.forEach((criterion) => {
      const total = criterion.controls.length;
      const implemented = criterion.controls.filter((c) => c.status === 'implemented').length;
      const partial = criterion.controls.filter((c) => c.status === 'partial').length;
      criterion.compliancePercentage = Math.round(((implemented + partial * 0.5) / total) * 100);
    });
  }

  getOverallCompliance(): number {
    const totalCompliance = Array.from(this.criteria.values()).reduce(
      (sum, c) => sum + c.compliancePercentage,
      0
    );
    return Math.round(totalCompliance / this.criteria.size);
  }

  getAllCriteria(): SOC2Criterion[] {
    return Array.from(this.criteria.values());
  }

  getCriterion(code: string): SOC2Criterion | undefined {
    return this.criteria.get(code);
  }

  updateControlStatus(criterionCode: string, controlId: string, status: string): void {
    const criterion = this.criteria.get(criterionCode);
    if (criterion) {
      const control = criterion.controls.find((c) => c.id === controlId);
      if (control) {
        control.status = status as any;
        this.calculateCompliance();
      }
    }
  }

  recordTestResult(controlId: string, result: any): void {
    if (!this.testResults.has(controlId)) {
      this.testResults.set(controlId, []);
    }
    this.testResults.get(controlId)!.push({
      ...result,
      timestamp: new Date(),
      testId: uuidv4(),
    });
  }

  uploadEvidence(controlId: string, evidence: any): void {
    if (!this.auditEvidence.has(controlId)) {
      this.auditEvidence.set(controlId, []);
    }
    this.auditEvidence.get(controlId)!.push({
      ...evidence,
      uploadedAt: new Date(),
      evidenceId: uuidv4(),
    });

    // Update control evidence count
    this.criteria.forEach((criterion) => {
      const control = criterion.controls.find((c) => c.id === controlId);
      if (control) {
        control.evidenceCount = this.auditEvidence.get(controlId)!.length;
      }
    });
  }

  getEvidence(controlId: string): any[] {
    return this.auditEvidence.get(controlId) || [];
  }

  createAttestation(scope: string[], auditorName: string): SOC2Attestation {
    const attestation: SOC2Attestation = {
      id: uuidv4(),
      period: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      scope,
      auditorName,
      status: 'in-progress',
      findings: 0,
      remediations: 0,
    };
    this.attestations.push(attestation);
    return attestation;
  }

  getAttestations(): SOC2Attestation[] {
    return this.attestations;
  }

  generateReport(format: 'executive' | 'detailed'): string {
    const overall = this.getOverallCompliance();
    const criteria = this.getAllCriteria();

    let report = `SOC 2 Type II Compliance Report\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Overall Compliance: ${overall}%\n\n`;

    if (format === 'executive') {
      report += `EXECUTIVE SUMMARY\n`;
      report += `================\n`;
      const implemented = criteria.filter((c) => c.compliancePercentage >= 80).length;
      const partial = criteria.filter((c) => c.compliancePercentage >= 50 && c.compliancePercentage < 80).length;
      const notMet = criteria.filter((c) => c.compliancePercentage < 50).length;

      report += `Criteria Met: ${implemented}\n`;
      report += `Criteria Partially Met: ${partial}\n`;
      report += `Criteria Not Met: ${notMet}\n`;
    } else {
      report += `DETAILED FINDINGS\n`;
      report += `================\n`;
      criteria.forEach((crit) => {
        report += `\n${crit.code} - ${crit.name}\n`;
        report += `Compliance: ${crit.compliancePercentage}%\n`;
        report += `Controls: ${crit.controls.length}\n`;
        crit.controls.forEach((ctrl) => {
          report += `  - ${ctrl.title}: ${ctrl.status}\n`;
        });
      });
    }

    return report;
  }

  exportAsJSON(): string {
    return JSON.stringify(
      {
        overallCompliance: this.getOverallCompliance(),
        criteria: this.getAllCriteria(),
        attestations: this.attestations,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  getComplianceTrend(): { date: Date; percentage: number }[] {
    // Mock trend data
    const trend: { date: Date; percentage: number }[] = [];
    for (let i = 90; i >= 0; i -= 30) {
      trend.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        percentage: Math.min(100, this.getOverallCompliance() - Math.random() * 10),
      });
    }
    return trend;
  }
}

export const soc2Manager = SOC2Manager.getInstance();
