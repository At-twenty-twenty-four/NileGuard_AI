/**
 * MITRE ATT&CK Framework Integration for EthioShield
 * Maps threat techniques to mitigation strategies and detection methods
 */

export interface MitreAttckTechnique {
  id: string;
  name: string;
  tacticsId: string;
  tactics: string[];
  description: string;
  mitigation: string[];
  detection: string[];
  platformsAffected: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  references: string[];
}

export interface MitreAttckTactic {
  id: string;
  name: string;
  description: string;
  techniques: string[]; // technique IDs
}

const MITRE_TACTICS: Record<string, MitreAttckTactic> = {
  'TA0001': {
    id: 'TA0001',
    name: 'Reconnaissance',
    description: 'Techniques used to gather information about targets before exploitation',
    techniques: ['T1592', '1598'],
  },
  'TA0002': {
    id: 'TA0002',
    name: 'Resource Development',
    description: 'Techniques used to create, buy, compromise, or rent resources used to support operations',
    techniques: ['T1583', '1586', '1608'],
  },
  'TA0003': {
    id: 'TA0003',
    name: 'Initial Access',
    description: 'Techniques used to gain an initial foothold into a network',
    techniques: ['T1189', '1195', '1200'],
  },
  'TA0004': {
    id: 'TA0004',
    name: 'Execution',
    description: 'Techniques used to run malicious code',
    techniques: ['T1059', '1559', '1609'],
  },
  'TA0005': {
    id: 'TA0005',
    name: 'Persistence',
    description: 'Techniques used to maintain their foothold in a system',
    techniques: ['T1098', '1197', '1547'],
  },
  'TA0006': {
    id: 'TA0006',
    name: 'Privilege Escalation',
    description: 'Techniques used to gain higher-level permissions on systems',
    techniques: ['T1134', '1547', '1548'],
  },
  'TA0007': {
    id: 'TA0007',
    name: 'Defense Evasion',
    description: 'Techniques used to avoid being detected or impede incident response',
    techniques: ['T1548', '1197', '1140'],
  },
  'TA0008': {
    id: 'TA0008',
    name: 'Credential Access',
    description: 'Techniques used to obtain valid credentials that can be used to access systems',
    techniques: ['T1110', '1187', '1056'],
  },
  'TA0009': {
    id: 'TA0009',
    name: 'Discovery',
    description: 'Techniques used to obtain information about systems and networks',
    techniques: ['T1217', '1526', '1538'],
  },
  'TA0010': {
    id: 'TA0010',
    name: 'Lateral Movement',
    description: 'Techniques used to move through a network to reach their objectives',
    techniques: ['T1570', '1570', '1570'],
  },
};

const MITRE_TECHNIQUES: Record<string, MitreAttckTechnique> = {
  'T1110': {
    id: 'T1110',
    name: 'Brute Force',
    tacticsId: 'TA0008',
    tactics: ['Credential Access'],
    description: 'Adversary may use brute force techniques to attempt access to accounts',
    mitigation: [
      'Implement account lockout policies',
      'Deploy MFA/2FA',
      'Use strong password policies',
      'Monitor failed login attempts',
    ],
    detection: [
      'Monitor for multiple failed login attempts',
      'Alert on account lockouts',
      'Track authentication failures',
      'Analyze failed login patterns',
    ],
    platformsAffected: ['Linux', 'macOS', 'Windows', 'Cloud'],
    severity: 'high',
    references: [
      'https://attack.mitre.org/techniques/T1110',
      'https://owasp.org/www-community/attacks/Brute_force_attack',
    ],
  },
  'T1059': {
    id: 'T1059',
    name: 'Command and Scripting Interpreter',
    tacticsId: 'TA0004',
    tactics: ['Execution'],
    description: 'Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries',
    mitigation: [
      'Restrict command execution',
      'Use execution policies',
      'Monitor script execution',
      'Disable unnecessary interpreters',
    ],
    detection: [
      'Monitor process execution logs',
      'Alert on unusual script execution',
      'Track command execution patterns',
      'Analyze script content',
    ],
    platformsAffected: ['Windows', 'Linux', 'macOS'],
    severity: 'critical',
    references: [
      'https://attack.mitre.org/techniques/T1059',
      'https://www.cyber.gov.au/alerts/advisory-2022-024',
    ],
  },
  'T1189': {
    id: 'T1189',
    name: 'Phishing',
    tacticsId: 'TA0003',
    tactics: ['Initial Access'],
    description: 'Adversaries send spear phishing messages to trick users into performing harmful actions',
    mitigation: [
      'User security awareness training',
      'Email filtering',
      'DNS filtering',
      'URL rewriting',
    ],
    detection: [
      'Monitor email traffic for malicious indicators',
      'Alert on suspicious links',
      'Track user clicks on phishing links',
      'Analyze email content',
    ],
    platformsAffected: ['Windows', 'Linux', 'macOS', 'Cloud'],
    severity: 'high',
    references: [
      'https://attack.mitre.org/techniques/T1189',
      'https://www.cyber.gov.au/alerts/advisory-2022-042',
    ],
  },
  'T1486': {
    id: 'T1486',
    name: 'Data Encrypted for Impact',
    tacticsId: 'TA0040',
    tactics: ['Impact'],
    description: 'Adversaries may encrypt data on target systems or on shared network drives',
    mitigation: [
      'Backup and recovery strategies',
      'Limit file share permissions',
      'Monitor file encryption activities',
      'Implement ransomware defenses',
    ],
    detection: [
      'Monitor for abnormal file encryption',
      'Alert on file extension changes',
      'Track mass file modifications',
      'Analyze file activity patterns',
    ],
    platformsAffected: ['Windows', 'Linux', 'macOS', 'Network'],
    severity: 'critical',
    references: [
      'https://attack.mitre.org/techniques/T1486',
      'https://www.cisa.gov/ransomware',
    ],
  },
};

class MitreAttckFramework {
  /**
   * Get all tactics
   */
  getAllTactics(): MitreAttckTactic[] {
    return Object.values(MITRE_TACTICS);
  }

  /**
   * Get specific tactic
   */
  getTactic(tacticId: string): MitreAttckTactic | undefined {
    return MITRE_TACTICS[tacticId];
  }

  /**
   * Get all techniques
   */
  getAllTechniques(): MitreAttckTechnique[] {
    return Object.values(MITRE_TECHNIQUES);
  }

  /**
   * Get specific technique
   */
  getTechnique(techniqueId: string): MitreAttckTechnique | undefined {
    return MITRE_TECHNIQUES[techniqueId];
  }

  /**
   * Get techniques by tactic
   */
  getTechniquesByTactic(tacticId: string): MitreAttckTechnique[] {
    const tactic = MITRE_TACTICS[tacticId];
    if (!tactic) return [];

    return tactic.techniques
      .map((id) => MITRE_TECHNIQUES[id])
      .filter(Boolean);
  }

  /**
   * Get mitigation strategies for a threat
   */
  getMitigationStrategies(threatName: string): string[] {
    const threat = Object.values(MITRE_TECHNIQUES).find(
      (t) => t.name.toLowerCase() === threatName.toLowerCase()
    );
    return threat?.mitigation || [];
  }

  /**
   * Get detection methods for a threat
   */
  getDetectionMethods(threatName: string): string[] {
    const threat = Object.values(MITRE_TECHNIQUES).find(
      (t) => t.name.toLowerCase() === threatName.toLowerCase()
    );
    return threat?.detection || [];
  }

  /**
   * Get techniques by severity
   */
  getTechniquesBySeverity(severity: 'critical' | 'high' | 'medium' | 'low'): MitreAttckTechnique[] {
    return Object.values(MITRE_TECHNIQUES).filter((t) => t.severity === severity);
  }

  /**
   * Get critical techniques (for dashboard highlighting)
   */
  getCriticalTechniques(): MitreAttckTechnique[] {
    return this.getTechniquesBySeverity('critical');
  }

  /**
   * Map CVE to MITRE techniques
   */
  mapCveToTechniques(cveId: string): MitreAttckTechnique[] {
    // This would typically query a mapping database
    // For now, return sample techniques
    return this.getTechniquesBySeverity('high');
  }

  /**
   * Generate threat response playbook
   */
  generatePlaybook(threatName: string): {
    threat: MitreAttckTechnique | undefined;
    mitigations: string[];
    detections: string[];
    responseSteps: string[];
  } {
    const threat = Object.values(MITRE_TECHNIQUES).find(
      (t) => t.name.toLowerCase() === threatName.toLowerCase()
    );

    return {
      threat,
      mitigations: threat?.mitigation || [],
      detections: threat?.detection || [],
      responseSteps: [
        '1. Identify affected systems',
        '2. Isolate affected systems if necessary',
        '3. Collect forensic evidence',
        '4. Analyze threat indicators',
        '5. Implement mitigation strategies',
        '6. Monitor for re-infection',
        '7. Document lessons learned',
      ],
    };
  }

  /**
   * Get attack chain for a tactic progression
   */
  getAttackChain(startTactic: string): MitreAttckTactic[] {
    const chain: MitreAttckTactic[] = [];
    const tacticOrder = [
      'TA0001', // Reconnaissance
      'TA0002', // Resource Development
      'TA0003', // Initial Access
      'TA0004', // Execution
      'TA0005', // Persistence
      'TA0006', // Privilege Escalation
      'TA0007', // Defense Evasion
      'TA0008', // Credential Access
      'TA0009', // Discovery
      'TA0010', // Lateral Movement
    ];

    const startIndex = tacticOrder.indexOf(startTactic);
    if (startIndex === -1) return chain;

    for (let i = startIndex; i < tacticOrder.length && chain.length < 5; i++) {
      const tactic = MITRE_TACTICS[tacticOrder[i]];
      if (tactic) chain.push(tactic);
    }

    return chain;
  }
}

export const mitreAttckFramework = new MitreAttckFramework();
