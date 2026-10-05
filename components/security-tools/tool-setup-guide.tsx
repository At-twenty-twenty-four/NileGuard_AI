'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ToolSetup {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToSetup: string;
  prerequisites: string[];
  configSteps: ConfigStep[];
  testCommand: string;
  documentation: string;
  apiEndpoint?: string;
}

interface ConfigStep {
  title: string;
  commands: string[];
  notes?: string;
}

const toolsSetupGuide: ToolSetup[] = [
  {
    name: 'Wazuh',
    description: 'Open-source threat detection and log analysis platform',
    difficulty: 'medium',
    timeToSetup: '30-45 minutes',
    prerequisites: ['Linux (Ubuntu 20.04+)', '4GB RAM', '20GB disk space', 'Network connectivity'],
    configSteps: [
      {
        title: 'Download and Install Wazuh Manager',
        commands: [
          'curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -',
          'echo "deb https://packages.wazuh.com/4.x/apt/ stable main" | tee /etc/apt/sources.list.d/wazuh.list',
          'apt-get update && apt-get install -y wazuh-manager',
        ],
        notes: 'Wazuh Manager collects and analyzes events from agents',
      },
      {
        title: 'Start Wazuh Service',
        commands: [
          'systemctl enable wazuh-manager',
          'systemctl start wazuh-manager',
          'systemctl status wazuh-manager',
        ],
      },
      {
        title: 'Configure in EthioShield',
        commands: [
          'Tool: Wazuh Manager',
          'API Endpoint: https://YOUR_WAZUH_SERVER:55000',
          'Username: wazuh',
          'Generate API Key in Wazuh Dashboard',
        ],
      },
    ],
    testCommand: 'curl -u wazuh:wazuh https://localhost:55000/security/users',
    documentation: '/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md#wazuh---threat-detection',
    apiEndpoint: 'https://localhost:55000',
  },
  {
    name: 'Suricata',
    description: 'Network threat detection engine with IDS/IPS capabilities',
    difficulty: 'medium',
    timeToSetup: '20-30 minutes',
    prerequisites: ['Linux (Ubuntu 20.04+)', '2GB RAM', 'Network interface access', 'Root access'],
    configSteps: [
      {
        title: 'Install Suricata',
        commands: [
          'sudo add-apt-repository ppa:oisf/suricata-stable',
          'sudo apt-get update && sudo apt-get install -y suricata',
          'suricata --version',
        ],
      },
      {
        title: 'Configure Network Interface',
        commands: [
          'ip link show',
          'sudo nano /etc/suricata/suricata.yaml',
          '# Update af-packet interface to your network interface (e.g., eth0)',
        ],
      },
      {
        title: 'Update Threat Rules',
        commands: [
          'sudo apt-get install -y suricata-update',
          'sudo suricata-update enable-source et/open',
          'sudo suricata-update',
        ],
      },
      {
        title: 'Start Suricata Service',
        commands: [
          'sudo systemctl enable suricata',
          'sudo systemctl start suricata',
          'tail -f /var/log/suricata/eve.json',
        ],
      },
    ],
    testCommand: 'tail -f /var/log/suricata/eve.json',
    documentation: '/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md#suricata---network-idsips',
    apiEndpoint: '/var/run/suricata/eve.sock',
  },
  {
    name: 'VirusTotal',
    description: 'Multi-engine malware and URL analysis service',
    difficulty: 'easy',
    timeToSetup: '5-10 minutes',
    prerequisites: ['VirusTotal Account', 'API Key', 'Network connectivity'],
    configSteps: [
      {
        title: 'Register and Get API Key',
        commands: [
          'Visit https://www.virustotal.com',
          'Create account or sign in',
          'Navigate to Settings > API Key',
          'Copy your API key',
        ],
      },
      {
        title: 'Configure in EthioShield',
        commands: [
          'Tool: VirusTotal',
          'API Endpoint: https://www.virustotal.com/api/v3',
          'API Key: [Your VirusTotal API key]',
          'File Size Limit: 650MB',
        ],
      },
    ],
    testCommand: 'curl https://www.virustotal.com/api/v3/intelligence/search -H "x-apikey: YOUR_API_KEY"',
    documentation: '/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md#virustotal---malware-analysis',
    apiEndpoint: 'https://www.virustotal.com/api/v3',
  },
  {
    name: 'TheHive',
    description: 'Open-source incident management and response platform',
    difficulty: 'hard',
    timeToSetup: '45-60 minutes',
    prerequisites: ['Elasticsearch 7.0+', 'MongoDB 4.0+', 'Java 11+', '4GB RAM', '20GB storage'],
    configSteps: [
      {
        title: 'Install Elasticsearch',
        commands: [
          'curl -qO https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -',
          'echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list',
          'apt-get update && apt-get install -y elasticsearch',
        ],
      },
      {
        title: 'Install MongoDB',
        commands: [
          'echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list',
          'apt-get update && apt-get install -y mongodb-org',
        ],
      },
      {
        title: 'Install TheHive',
        commands: [
          'curl https://raw.githubusercontent.com/TheHive-Project/TheHive/master/PGP-PUBLIC-KEY | apt-key add -',
          'echo "deb https://deb.thehive-project.org release main" | tee /etc/apt/sources.list.d/thehive-project.list',
          'apt-get update && apt-get install -y thehive',
        ],
      },
      {
        title: 'Start Services',
        commands: [
          'systemctl enable elasticsearch mongod thehive',
          'systemctl start elasticsearch mongod thehive',
          'curl http://localhost:9000',
        ],
        notes: 'Default login: admin@thehive.local / secret',
      },
    ],
    testCommand: 'curl http://localhost:9000/api/status',
    documentation: '/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md#thehive---incident-management',
    apiEndpoint: 'http://localhost:9000',
  },
  {
    name: 'SHODAN',
    description: 'IoT and device intelligence platform with vulnerability scanning',
    difficulty: 'easy',
    timeToSetup: '5-10 minutes',
    prerequisites: ['SHODAN Account', 'API Key', 'Network connectivity'],
    configSteps: [
      {
        title: 'Register and Get API Key',
        commands: [
          'Visit https://www.shodan.io',
          'Create account',
          'Go to Account > API Key',
          'Copy your API key',
        ],
      },
      {
        title: 'Configure in EthioShield',
        commands: [
          'Tool: SHODAN Intelligence',
          'API Endpoint: https://api.shodan.io',
          'API Key: [Your SHODAN API key]',
          'Enable Device Monitoring',
        ],
      },
    ],
    testCommand: 'curl https://api.shodan.io/api/info?key=YOUR_API_KEY',
    documentation: '/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md#shodan---iotdevice-intelligence',
    apiEndpoint: 'https://api.shodan.io',
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400';
  }
}

interface ToolDetailsProps {
  tool: ToolSetup;
  onClose: () => void;
}

function ToolDetailsModal({ tool, onClose }: ToolDetailsProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (command: string, stepIndex: number) => {
    navigator.clipboard.writeText(command);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{tool.name} Setup Guide</h2>
            <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background/50 rounded p-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Difficulty</p>
              <Badge className={`${getDifficultyColor(tool.difficulty)} border mt-2 capitalize text-xs`}>
                {tool.difficulty}
              </Badge>
            </div>
            <div className="bg-background/50 rounded p-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Setup Time</p>
              <p className="text-sm text-foreground mt-2">{tool.timeToSetup}</p>
            </div>
            <div className="bg-background/50 rounded p-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">API Endpoint</p>
              <p className="text-xs text-foreground mt-2 truncate">{tool.apiEndpoint}</p>
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Prerequisites
            </h3>
            <ul className="space-y-2">
              {tool.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>

          {/* Configuration Steps */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Configuration Steps</h3>
            <div className="space-y-6">
              {tool.configSteps.map((step, stepIdx) => (
                <div key={stepIdx} className="border border-border rounded-lg p-4 bg-background/50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {stepIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                      {step.notes && <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>}
                    </div>
                  </div>

                  <div className="space-y-2 ml-11">
                    {step.commands.map((command, cmdIdx) => (
                      <div
                        key={cmdIdx}
                        className="bg-black/30 border border-primary/20 rounded p-2 flex items-center justify-between group"
                      >
                        <code className="text-xs text-foreground font-mono flex-1 truncate">{command}</code>
                        <button
                          onClick={() => copyToClipboard(command, stepIdx * 100 + cmdIdx)}
                          className="opacity-0 group-hover:opacity-100 transition ml-2"
                          title="Copy command"
                        >
                          {copiedStep === stepIdx * 100 + cmdIdx ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Command */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Test Integration
            </h4>
            <div className="bg-black/30 rounded p-2">
              <code className="text-xs text-foreground font-mono">{tool.testCommand}</code>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Full Documentation</p>
              <p className="text-xs text-muted-foreground">Access the complete integration guide</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('/docs/SECURITY_TOOLS_INTEGRATION_GUIDE.md', '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
              Read
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ToolSetupGuide() {
  const [selectedTool, setSelectedTool] = useState<ToolSetup | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Recommended Tools - Setup Guide
        </h2>
        <p className="text-muted-foreground mt-1">Step-by-step installation and configuration guides for recommended security tools</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsSetupGuide.map((tool) => (
          <div
            key={tool.name}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                <Badge className={`${getDifficultyColor(tool.difficulty)} border text-xs mt-2 capitalize`}>
                  {tool.difficulty}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 flex-1">{tool.description}</p>

            <div className="space-y-2 text-xs text-muted-foreground mb-4">
              <p>Setup Time: {tool.timeToSetup}</p>
              <p>Steps: {tool.configSteps.length}</p>
            </div>

            <Button
              onClick={() => setSelectedTool(tool)}
              className="w-full gap-2 bg-primary/20 hover:bg-primary/30 text-primary"
            >
              <BookOpen className="w-4 h-4" />
              View Setup Guide
            </Button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTool && <ToolDetailsModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </div>
  );
}
