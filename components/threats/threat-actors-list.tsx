'use client';

import { Shield, MapPin, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ThreatActorsListProps {
  locale: string;
}

const threatActors = [
  {
    id: 1,
    name: 'APT-33 (Elfin)',
    country: 'Iran',
    sophistication: 'Advanced',
    motivation: 'Espionage, Financial',
    firstSeen: '2013',
    lastSeen: '2024-01-15',
    threatlevel: 'critical',
    tactics: ['Spear-Phishing', 'Supply Chain', 'Lateral Movement'],
    knownMalware: ['Shamoon', 'Stonedrill', 'Backdoor.APT33'],
    cvss: 9.2,
  },
  {
    id: 2,
    name: 'Lazarus Group',
    country: 'North Korea',
    sophistication: 'Expert',
    motivation: 'Financial, Political',
    firstSeen: '2009',
    lastSeen: '2024-01-20',
    threatlevel: 'critical',
    tactics: ['Supply Chain', 'Watering Hole', 'Code Injection'],
    knownMalware: ['MATA Framework', 'AppleJeus', 'Manuscrypt'],
    cvss: 9.8,
  },
  {
    id: 3,
    name: 'Turla (Snake)',
    country: 'Russia',
    sophistication: 'Expert',
    motivation: 'Intelligence Gathering',
    firstSeen: '2007',
    lastSeen: '2024-01-18',
    threatlevel: 'critical',
    tactics: ['Kernel Exploitation', 'Packet Sniffer', 'C2 Beaconing'],
    knownMalware: ['Turla.C', 'Carbon Backdoor', 'Watering Hole Toolkit'],
    cvss: 9.6,
  },
  {
    id: 4,
    name: 'FIN7 (Carbanak)',
    country: 'Various',
    sophistication: 'Advanced',
    motivation: 'Financial Gain',
    firstSeen: '2013',
    lastSeen: '2024-01-12',
    threatlevel: 'high',
    tactics: ['Spear-Phishing', 'Social Engineering', 'Malware Distribution'],
    knownMalware: ['Carbanak', 'Anunak', 'JSSLoader'],
    cvss: 8.9,
  },
  {
    id: 5,
    name: 'Conti Ransomware Gang',
    country: 'Russia',
    sophistication: 'Advanced',
    motivation: 'Financial Extortion',
    firstSeen: '2020',
    lastSeen: '2024-01-08',
    threatlevel: 'high',
    tactics: ['Double Extortion', 'Ransomware', 'Data Exfiltration'],
    knownMalware: ['Conti Ransomware', 'Emotet Loader', 'IcedID'],
    cvss: 8.7,
  },
];

const getSeverityColor = (level: string) => {
  switch (level) {
    case 'critical':
      return 'bg-destructive/20 text-destructive border-destructive/50';
    case 'high':
      return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    default:
      return 'bg-green-500/20 text-green-500 border-green-500/50';
  }
};

export function ThreatActorsList({ locale }: ThreatActorsListProps) {
  return (
    <div className="space-y-4 mt-6">
      {threatActors.map((actor) => (
        <div
          key={actor.id}
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{actor.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {actor.country}
                <span className="mx-1">•</span>
                <Zap className="w-4 h-4" />
                CVSS {actor.cvss}
              </div>
            </div>
            <Badge className={`${getSeverityColor(actor.threatlevel)}`}>
              {actor.threatlevel.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Active Period</p>
              <p className="text-sm text-foreground">{actor.firstSeen} - {actor.lastSeen}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Sophistication</p>
              <p className="text-sm text-foreground">{actor.sophistication}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Motivation</p>
              <p className="text-sm text-foreground">{actor.motivation}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Last Seen</p>
              <p className="text-sm text-foreground">{actor.lastSeen}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Tactics & Techniques</p>
              <div className="flex flex-wrap gap-2">
                {actor.tactics.map((tactic) => (
                  <Badge
                    key={tactic}
                    className="bg-primary/20 text-primary border border-primary/50 text-xs"
                  >
                    {tactic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Known Malware</p>
              <div className="flex flex-wrap gap-2">
                {actor.knownMalware.map((malware) => (
                  <Badge
                    key={malware}
                    className="bg-accent/20 text-accent border border-accent/50 text-xs"
                  >
                    {malware}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
