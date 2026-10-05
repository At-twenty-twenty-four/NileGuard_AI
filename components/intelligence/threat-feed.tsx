'use client';

import { useState } from 'react';
import { Globe, TrendingUp, AlertTriangle, Eye, Download, Share2, Clock, Tag, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThreatFeedDetailsModal } from './threat-feed-details-modal';

interface ThreatFeed {
  id: string;
  title: string;
  description: string;
  source: string;
  type: 'malware' | 'vulnerability' | 'indicator' | 'campaign' | 'actor';
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
  indicators: string[];
  mitigations: string[];
  references: string[];
  tlp: 'white' | 'green' | 'amber' | 'red';
}

const threatFeeds: ThreatFeed[] = [
  {
    id: 'TI-2024-001',
    title: 'Emotet Malware Campaign - Active Distribution',
    description: 'Active Emotet banking trojan campaign detected targeting financial institutions across North Africa. Multiple C2 servers are actively distributing payloads.',
    source: 'VirusTotal',
    type: 'malware',
    severity: 'critical',
    confidence: 0.98,
    timestamp: '2024-01-20 14:32',
    indicators: ['192.168.1.50', '10.0.0.1', 'malware.emotet.com', 'emotet-payload.exe'],
    mitigations: ['Block identified IPs', 'Update antivirus signatures', 'Educate users on phishing'],
    references: ['https://virustotal.com/emotet-2024', 'https://isc.sans.edu/emotet'],
    tlp: 'white',
  },
  {
    id: 'TI-2024-002',
    title: 'Zero-Day Vulnerability in OpenSSL (CVE-2024-0567)',
    description: 'Critical zero-day vulnerability discovered in OpenSSL affecting versions before 3.1.5. Remote code execution possible.',
    source: 'NVD',
    type: 'vulnerability',
    severity: 'critical',
    confidence: 0.99,
    timestamp: '2024-01-20 12:15',
    indicators: ['OpenSSL < 3.1.5', 'CVSS 9.8'],
    mitigations: ['Patch OpenSSL to 3.1.5 or later', 'Implement WAF rules', 'Monitor for exploitation'],
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-0567'],
    tlp: 'white',
  },
  {
    id: 'TI-2024-003',
    title: 'APT-33 (Elfin) Infrastructure Update',
    description: 'New infrastructure discovered attributed to APT-33. Active targeting of aerospace and energy sectors.',
    source: 'AlienVault OTX',
    type: 'actor',
    severity: 'high',
    confidence: 0.95,
    timestamp: '2024-01-20 10:45',
    indicators: ['45.33.32.156', 'apt33-c2.network', 'apt33.email@domain.com'],
    mitigations: ['Add IPs to blocklist', 'Enhanced monitoring for APT-33 TTPs', 'Incident response readiness'],
    references: ['https://otx.alienvault.com/pulse/apt-33'],
    tlp: 'green',
  },
  {
    id: 'TI-2024-004',
    title: 'LockBit 3.0 Ransomware - New Variant Detection',
    description: 'New LockBit 3.0 variant detected with improved encryption and faster propagation. Targets healthcare and critical infrastructure.',
    source: 'SHODAN',
    type: 'malware',
    severity: 'critical',
    confidence: 0.92,
    timestamp: '2024-01-19 23:20',
    indicators: ['lockbit-c2-1.onion', 'lockbit-payload-v3.bin', 'file_hash_sha256_xxxxx'],
    mitigations: ['Backup all systems', 'Network segmentation', 'Ransomware detection signatures'],
    references: ['https://shodan.io/lockbit-3.0'],
    tlp: 'amber',
  },
  {
    id: 'TI-2024-005',
    title: 'Phishing Infrastructure - Mass Email Campaign',
    description: 'Large-scale phishing infrastructure targeting multiple organizations. Infrastructure hosted on compromised servers.',
    source: 'STIX Feed',
    type: 'campaign',
    severity: 'high',
    confidence: 0.88,
    timestamp: '2024-01-19 18:00',
    indicators: ['phishing-domain-1.ru', '172.16.0.1', 'malicious.pdf', 'invoice-payment.docm'],
    mitigations: ['Email gateway filtering', 'User awareness training', 'Block sender domains'],
    references: ['https://stix.mitre.org/campaign-2024-05'],
    tlp: 'white',
  },
];

interface ThreatFeedProps {
  locale: string;
  filterType?: string;
}

export function ThreatFeed({ locale, filterType }: ThreatFeedProps) {
  const [selectedFeed, setSelectedFeed] = useState<ThreatFeed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewedFeeds, setViewedFeeds] = useState<Set<string>>(new Set());

  const filtered = filterType
    ? threatFeeds.filter((feed) => feed.type === filterType.toLowerCase())
    : threatFeeds;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/20 text-red-400 border-red-700/30';
      case 'high':
        return 'bg-orange-900/20 text-orange-400 border-orange-700/30';
      case 'medium':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30';
      case 'low':
        return 'bg-green-900/20 text-green-400 border-green-700/30';
      default:
        return 'bg-blue-900/20 text-blue-400';
    }
  };

  const getTLPColor = (tlp: string) => {
    switch (tlp) {
      case 'white':
        return 'bg-slate-700 text-white';
      case 'green':
        return 'bg-green-700 text-white';
      case 'amber':
        return 'bg-amber-700 text-white';
      case 'red':
        return 'bg-red-700 text-white';
      default:
        return 'bg-slate-600';
    }
  };

  const handleViewFeed = (feed: ThreatFeed) => {
    setSelectedFeed(feed);
    setIsModalOpen(true);
    setViewedFeeds(new Set([...viewedFeeds, feed.id]));
  };

  const handleExport = () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        totalFeeds: filtered.length,
        feeds: filtered.map((feed) => ({
          id: feed.id,
          title: feed.title,
          description: feed.description,
          source: feed.source,
          type: feed.type,
          severity: feed.severity,
          confidence: feed.confidence,
          timestamp: feed.timestamp,
          indicators: feed.indicators,
          mitigations: feed.mitigations,
          references: feed.references,
          tlp: feed.tlp,
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threat-feeds-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[v0] Error exporting threat feeds:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Threat Intelligence Feeds</h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No threat feeds found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((feed) => (
            <div
              key={feed.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{feed.title}</h3>
                    <Badge variant="outline" className="text-xs">{feed.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feed.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Badge className={`${getSeverityColor(feed.severity)} border text-xs text-center`}>
                    {feed.severity.toUpperCase()}
                  </Badge>
                  <Badge className={`${getTLPColor(feed.tlp)} text-xs text-center`}>
                    TLP: {feed.tlp.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-background/50 rounded-lg mb-4 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Type</p>
                  <p className="text-sm text-foreground mt-1 capitalize">{feed.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Source</p>
                  <p className="text-sm text-foreground mt-1">{feed.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Confidence</p>
                  <p className="text-sm text-foreground font-semibold mt-1">{Math.round(feed.confidence * 100)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Indicators</p>
                  <p className="text-sm text-foreground font-semibold mt-1">{feed.indicators.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Updated</p>
                  <div className="flex items-center gap-1 text-sm text-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {feed.timestamp}
                  </div>
                </div>
              </div>

              {/* Indicators Preview */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Key Indicators</p>
                <div className="flex flex-wrap gap-2">
                  {feed.indicators.slice(0, 3).map((indicator, idx) => (
                    <Tag key={idx} className="w-4 h-4" />
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {feed.indicators.length} total indicator{feed.indicators.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button className="p-2 hover:bg-primary/10 rounded transition" title="Share">
                  <Share2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
                <button 
                  onClick={() => handleViewFeed(feed)}
                  className="px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded hover:bg-primary/30 transition text-sm font-medium flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFeed && (
        <ThreatFeedDetailsModal
          feed={selectedFeed}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
