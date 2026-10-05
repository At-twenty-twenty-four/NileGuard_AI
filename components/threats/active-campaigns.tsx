'use client';

import { useState } from 'react';
import { Target, Users, Globe, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Campaign {
  id: string;
  name: string;
  actors: string[];
  affectedCountries: string[];
  targetIndustries: string[];
  description: string;
  startDate: string;
  lastActivity: string;
  severity: 'critical' | 'high' | 'medium';
  indicators: number;
  victimCount: number;
  status: 'active' | 'paused' | 'concluded';
}

const campaigns: Campaign[] = [
  {
    id: 'CAMP-2024-001',
    name: 'Operation Stealth Drake',
    actors: ['APT-28', 'Fancy Bear'],
    affectedCountries: ['US', 'EU', 'Canada', 'Australia'],
    targetIndustries: ['Defense', 'Government', 'Technology'],
    description: 'Sophisticated spear-phishing campaign targeting government agencies and defense contractors. Uses advanced persistence mechanisms.',
    startDate: '2024-01-15',
    lastActivity: '2024-01-22 14:32',
    severity: 'critical',
    indicators: 127,
    victimCount: 24,
    status: 'active',
  },
  {
    id: 'CAMP-2024-002',
    name: 'LockBit Extortion Wave',
    actors: ['LockBit Gang'],
    affectedCountries: ['UK', 'Germany', 'France', 'Japan'],
    targetIndustries: ['Healthcare', 'Finance', 'Energy'],
    description: 'Mass ransomware campaign with automated deployment and data exfiltration. Highly organized extortion infrastructure.',
    startDate: '2024-01-10',
    lastActivity: '2024-01-22 08:15',
    severity: 'critical',
    indicators: 89,
    victimCount: 156,
    status: 'active',
  },
  {
    id: 'CAMP-2024-003',
    name: 'Emotet Malware Distribution',
    actors: ['TA542'],
    affectedCountries: ['North Africa', 'Middle East', 'South Asia'],
    targetIndustries: ['Finance', 'Retail', 'Education'],
    description: 'Banking trojan distribution via compromised email systems. Multiple C2 server network actively distributing payloads.',
    startDate: '2024-01-08',
    lastActivity: '2024-01-21 22:45',
    severity: 'high',
    indicators: 203,
    victimCount: 42,
    status: 'active',
  },
  {
    id: 'CAMP-2024-004',
    name: 'Lazarus Cryptocurrency Theft',
    actors: ['Lazarus Group', 'North Korea'],
    affectedCountries: ['South Korea', 'US', 'Singapore'],
    targetIndustries: ['Cryptocurrency', 'Finance'],
    description: 'Targeted attacks on cryptocurrency exchanges and trading platforms. Steals digital assets using sophisticated social engineering.',
    startDate: '2024-01-05',
    lastActivity: '2024-01-20 19:30',
    severity: 'high',
    indicators: 67,
    victimCount: 8,
    status: 'active',
  },
  {
    id: 'CAMP-2024-005',
    name: 'Snake Keylogger Campaign',
    actors: ['Dark Halo'],
    affectedCountries: ['EU', 'USA'],
    targetIndustries: ['Government', 'Technology', 'Finance'],
    description: 'Sophisticated keylogging campaign targeting high-value entities. Uses advanced obfuscation and anti-analysis techniques.',
    startDate: '2023-12-20',
    lastActivity: '2024-01-19 11:22',
    severity: 'high',
    indicators: 45,
    victimCount: 12,
    status: 'paused',
  },
];

export function ActiveCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/20 text-red-400 border-red-700/30';
      case 'high':
        return 'bg-orange-900/20 text-orange-400 border-orange-700/30';
      case 'medium':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30';
      default:
        return 'bg-blue-900/20 text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-400';
      case 'paused':
        return 'bg-yellow-900/20 text-yellow-400';
      case 'concluded':
        return 'bg-blue-900/20 text-blue-400';
      default:
        return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Active Campaigns</p>
          <p className="text-2xl font-bold text-foreground mt-2">{campaigns.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-red-700/30 rounded-lg p-4">
          <p className="text-xs text-red-400 uppercase font-semibold">Critical Campaigns</p>
          <p className="text-2xl font-bold text-red-400 mt-2">{campaigns.filter(c => c.severity === 'critical').length}</p>
        </div>
        <div className="bg-card border border-primary/30 rounded-lg p-4">
          <p className="text-xs text-primary uppercase font-semibold">Total Actors</p>
          <p className="text-2xl font-bold text-primary mt-2">{new Set(campaigns.flatMap(c => c.actors)).size}</p>
        </div>
        <div className="bg-card border border-orange-700/30 rounded-lg p-4">
          <p className="text-xs text-orange-400 uppercase font-semibold">Confirmed Victims</p>
          <p className="text-2xl font-bold text-orange-400 mt-2">{campaigns.reduce((sum, c) => sum + c.victimCount, 0)}</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition cursor-pointer"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{campaign.name}</h3>
                  <Badge variant="outline" className="text-xs">{campaign.id}</Badge>
                  <Badge className={`${getStatusColor(campaign.status)} border text-xs capitalize`}>
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
              </div>
              <Badge className={`${getSeverityColor(campaign.severity)} border text-xs ml-4`}>
                {campaign.severity.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-background/50 rounded-lg mb-4 border border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Start Date</p>
                <div className="flex items-center gap-1 text-sm text-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(campaign.startDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Last Activity</p>
                <p className="text-sm text-foreground mt-1">{campaign.lastActivity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Indicators</p>
                <p className="text-sm font-semibold text-foreground mt-1">{campaign.indicators}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Victims</p>
                <p className="text-sm font-semibold text-orange-400 mt-1">{campaign.victimCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Actors</p>
                <p className="text-sm font-semibold text-foreground mt-1">{campaign.actors.length}</p>
              </div>
            </div>

            {/* Affected Regions and Industries */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <div className="flex gap-1 flex-wrap">
                  {campaign.affectedCountries.map((country) => (
                    <Badge key={country} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-xs text-muted-foreground font-semibold">Target Industries:</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {campaign.targetIndustries.map((industry) => (
                  <Badge key={industry} className="bg-primary/20 text-primary text-xs border-primary/50 border">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
