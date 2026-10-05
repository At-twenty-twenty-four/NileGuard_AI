// Security Tools Integration Configuration
// This file defines the supported security tools and their integration details

export interface SecurityTool {
  id: string;
  name: string;
  category: 'SIEM' | 'IDS/IPS' | 'Reputation' | 'Incidents' | 'Discovery';
  description: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  icon: string;
  capabilities: string[];
  apiEndpoint?: string;
  apiKey?: string;
}

export const SECURITY_TOOLS: SecurityTool[] = [
  {
    id: 'wazuh',
    name: 'Wazuh',
    category: 'SIEM',
    description: 'Open-source security monitoring platform. Provides SIEM capabilities, log analysis, file integrity monitoring, and compliance reporting.',
    enabled: true,
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    icon: 'shield-alert',
    capabilities: [
      'Real-time log analysis',
      'File integrity monitoring',
      'Configuration assessment',
      'Vulnerability detection',
      'Compliance reporting',
      'Active response',
    ],
  },
  {
    id: 'suricata',
    name: 'Suricata',
    category: 'IDS/IPS',
    description: 'High-performance open-source network intrusion detection and prevention engine. Provides real-time threat detection.',
    enabled: true,
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    icon: 'activity',
    capabilities: [
      'Network intrusion detection',
      'Intrusion prevention',
      'Protocol analysis',
      'File extraction',
      'DNS logging',
      'HTTP logging',
    ],
  },
  {
    id: 'virustotal',
    name: 'VirusTotal',
    category: 'Reputation',
    description: 'Free online service for analyzing files and URLs. Aggregates results from 70+ antivirus engines.',
    enabled: true,
    status: 'connected',
    lastSync: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    icon: 'virus',
    capabilities: [
      'File hash lookup',
      'IP reputation scoring',
      'Domain reputation scoring',
      'Malware family identification',
      'URL analysis',
      'Threat indicators',
    ],
  },
  {
    id: 'thehive',
    name: 'TheHive',
    category: 'Incidents',
    description: 'Open-source incident response and management platform. Enables case management and observables tracking.',
    enabled: true,
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    icon: 'briefcase',
    capabilities: [
      'Case management',
      'Observables management',
      'Automated analysis',
      'Incident collaboration',
      'Timeline visualization',
      'Task management',
    ],
  },
  {
    id: 'shodan',
    name: 'SHODAN',
    category: 'Discovery',
    description: 'Search engine for internet-connected devices. Enables asset discovery and exposure management.',
    enabled: true,
    status: 'connected',
    lastSync: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
    icon: 'globe',
    capabilities: [
      'Internet device discovery',
      'Open port detection',
      'Service identification',
      'Vulnerability detection',
      'Exposure mapping',
      'Geolocation lookup',
    ],
  },
];

export const TOOL_CATEGORIES = {
  SIEM: 'Security Information and Event Management',
  'IDS/IPS': 'Intrusion Detection/Prevention Systems',
  Reputation: 'File and IP Reputation Services',
  Incidents: 'Incident Management Platforms',
  Discovery: 'Asset Discovery and Scanning',
};
