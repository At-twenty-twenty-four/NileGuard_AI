'use client';

import { useState } from 'react';
import { Network, Shield, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SimulatorProps {
  locale: string;
}

export function DigitalTwinSimulator({ locale }: SimulatorProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [networkNodes] = useState([
    { id: 1, name: 'Firewall', status: 'secure', x: 10, y: 20 },
    { id: 2, name: 'Web Server', status: 'secure', x: 50, y: 20 },
    { id: 3, name: 'Database', status: 'secure', x: 90, y: 20 },
    { id: 4, name: 'API Gateway', status: 'secure', x: 30, y: 60 },
    { id: 5, name: 'Cache Layer', status: 'secure', x: 70, y: 60 },
    { id: 6, name: 'DNS Server', status: 'secure', x: 50, y: 80 },
  ]);

  const [threats] = useState([
    { id: 1, name: 'DDoS Attack', severity: 'critical', target: 'Firewall', progress: 45 },
    { id: 2, name: 'Brute Force', severity: 'high', target: 'Web Server', progress: 30 },
    { id: 3, name: 'SQL Injection Attempt', severity: 'medium', target: 'Database', progress: 15 },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setResetKey((prev) => prev + 1);
  };

  const texts = {
    en: {
      title: 'Digital Twin Network Simulator',
      description: 'Real-time network topology and threat simulation',
      networkTopology: 'Network Topology',
      simulatedThreats: 'Simulated Threats',
      status: 'Status',
      running: 'Running',
      paused: 'Paused',
      offline: 'Offline',
    },
    am: {
      title: 'ዲጂታል መንትዋ ዴትዋርክ ሲሙሌተር',
      description: 'በእውነት ጊዜ የኔትወርክ ቦታ እና ስጋት ሲሙሌሽን',
      networkTopology: 'የኔትወርክ ቦታ',
      simulatedThreats: 'የተሞከሩ ስጋቶች',
      status: 'ሁኔታ',
      running: 'ሩጫ',
      paused: 'ሰርቶ ቆሞ',
      offline: 'ስላይን ነው',
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

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-primary hover:bg-primary/90"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              {t.paused}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t.running}
            </>
          )}
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline" 
          className="border-primary/30 hover:border-primary/50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            {t.networkTopology}
          </h2>
          
          <div className="bg-background/50 rounded-lg p-8 min-h-96 relative overflow-hidden border border-primary/10">
            {/* SVG Network Diagram */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines */}
              <line x1="10" y1="20" x2="50" y2="20" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
              <line x1="50" y1="20" x2="90" y2="20" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
              <line x1="50" y1="20" x2="30" y2="60" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
              <line x1="50" y1="20" x2="70" y2="60" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
              <line x1="30" y1="60" x2="50" y2="80" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
              <line x1="70" y1="60" x2="50" y2="80" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />

              {/* Nodes */}
              {networkNodes.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="4" fill="rgba(14, 165, 233, 0.5)" />
                  <circle cx={node.x} cy={node.y} r="3" fill="rgba(6, 182, 212, 1)" />
                  <text x={node.x} y={node.y + 8} fontSize="3" fill="rgba(241, 245, 249, 0.7)" textAnchor="middle">
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              ))}
            </svg>

            {!isRunning && (
              <div className="absolute inset-0 bg-background/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Pause className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-2" />
                  <p className="text-muted-foreground">{t.paused}</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground">Online Nodes</p>
              <p className="text-2xl font-bold text-primary">6/6</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-orange-500/10">
              <p className="text-xs text-muted-foreground">Active Threats</p>
              <p className="text-2xl font-bold text-orange-500">3</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-accent/10">
              <p className="text-xs text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold text-accent">94%</p>
            </div>
          </div>
        </div>

        {/* Threats Panel */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {t.simulatedThreats}
          </h2>

          <div className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className={`p-3 rounded-lg ${getSeverityColor(threat.severity)} border border-current/20`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{threat.name}</p>
                    <p className="text-xs opacity-75">Target: {threat.target}</p>
                  </div>
                  <Badge className="ml-2">{threat.severity}</Badge>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div
                    className="h-full rounded-full bg-current transition-all"
                    style={{ width: `${threat.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 opacity-75">{threat.progress}% progress</p>
              </div>
            ))}
          </div>

          {/* Defense Status */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <p className="font-semibold text-primary">Active Defenses</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Automated response protocols active. All threats being mitigated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
