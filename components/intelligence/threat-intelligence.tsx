'use client';

import { useState } from 'react';
import { Globe, TrendingUp, Users, AlertTriangle, Search, Filter, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IntelligenceProps {
  locale: string;
}

export function ThreatIntelligence({ locale }: IntelligenceProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const feeds = [
    { id: 1, name: 'STIX/TAXII Feed', provider: 'Abusers Exchange', threats: 2847, lastUpdate: '2 hours ago', confidence: 95 },
    { id: 2, name: 'VirusTotal Intelligence', provider: 'Google', threats: 1253, lastUpdate: '1 hour ago', confidence: 98 },
    { id: 3, name: 'Shodan IoT Threats', provider: 'Shodan', threats: 483, lastUpdate: '30 min ago', confidence: 88 },
    { id: 4, name: 'OSINT Darknet Feed', provider: 'Custom', threats: 156, lastUpdate: '15 min ago', confidence: 92 },
  ];

  const threatActors = [
    { id: 1, name: 'APT28 (Fancy Bear)', country: 'Russia', threatLevel: 'Critical', known_malware: 'Sofacy, X-Agent', active_regions: 'NATO, EU' },
    { id: 2, name: 'APT41 (Winnti)', country: 'China', threatLevel: 'Critical', known_malware: 'PlugX, ChChes', active_regions: 'Global' },
    { id: 3, name: 'Lazarus Group', country: 'North Korea', threatLevel: 'Critical', known_malware: 'WannaCry, Triton', active_regions: 'Global' },
    { id: 4, name: 'APT1 (Comment Crew)', country: 'China', threatLevel: 'High', known_malware: 'Poison Ivy, DeputyDog', active_regions: 'US, EU' },
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-destructive/20 text-destructive';
      case 'High':
        return 'bg-orange-500/20 text-orange-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const texts = {
    en: {
      title: 'Threat Intelligence Hub',
      description: 'OSINT feeds, threat actor profiles, and vulnerability intelligence',
      threatFeeds: 'Threat Intelligence Feeds',
      provider: 'Provider',
      threats: 'Threats',
      lastUpdate: 'Last Update',
      confidence: 'Confidence',
      knownActors: 'Known Threat Actors',
      country: 'Country',
      threatLevel: 'Threat Level',
      knownMalware: 'Known Malware',
      activeRegions: 'Active Regions',
    },
    am: {
      title: 'ስጋት ዕውቀት ሕብር',
      description: 'OSINT ምግቦች, ስጋት ተዋናዮች ሥዕሎች, እና ተፈትሞ የተዘጋ የብስ ዕውቀት',
      threatFeeds: 'ስጋት ዕውቀት ምግቦች',
      provider: 'ሲያከሄደው',
      threats: 'ስጋቶች',
      lastUpdate: 'የመጨረሻ ዝመና',
      confidence: 'ተስፋ',
      knownActors: 'የታወቁ ስጋት ተዋናዮች',
      country: 'ሀገር',
      threatLevel: 'ስጋት ደረጃ',
      knownMalware: 'የታወቀ ስጋት',
      activeRegions: 'ንቁ ክልሎች',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Feeds Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {t.threatFeeds}
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search feeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-primary/30"
              />
            </div>
            <Button variant="outline" className="border-primary/30">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {feeds.map((feed) => (
            <div key={feed.id} className="p-4 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{feed.name}</p>
                  <p className="text-sm text-muted-foreground">{feed.provider}</p>
                </div>
                <Badge className="bg-primary/20 text-primary">{feed.confidence}%</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground text-xs">{t.threats}</p>
                  <p className="font-semibold text-foreground">{feed.threats}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t.lastUpdate}</p>
                  <p className="font-semibold text-foreground">{feed.lastUpdate}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Feed
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert(`Share Feed: ${feed.name}\n\nSharing options:\n- Copy link to clipboard\n- Email to team members\n- Export as PDF/CSV\n- Integrate with other tools`)}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Actors */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-destructive" />
          {t.knownActors}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">{t.country}</th>
                <th className="pb-3 font-semibold">{t.threatLevel}</th>
                <th className="pb-3 font-semibold">{t.knownMalware}</th>
                <th className="pb-3 font-semibold">{t.activeRegions}</th>
              </tr>
            </thead>
            <tbody>
              {threatActors.map((actor) => (
                <tr key={actor.id} className="border-b border-border/50 hover:bg-background/50 transition cursor-pointer">
                  <td className="py-4 font-medium text-foreground">{actor.name}</td>
                  <td className="py-4 text-muted-foreground">{actor.country}</td>
                  <td className="py-4">
                    <Badge className={getThreatColor(actor.threatLevel)}>
                      {actor.threatLevel}
                    </Badge>
                  </td>
                  <td className="py-4 text-muted-foreground text-xs max-w-xs truncate" title={actor.known_malware}>
                    {actor.known_malware}
                  </td>
                  <td className="py-4 text-muted-foreground">{actor.active_regions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
