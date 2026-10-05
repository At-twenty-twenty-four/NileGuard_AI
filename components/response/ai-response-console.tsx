'use client';

import { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIResponseConsoleProps {
  locale: string;
}

const responseScenarios = [
  {
    id: 1,
    threatId: 'THR-2024-001',
    threat: 'Intrusion Detection: Port Scan',
    source: '192.168.1.105',
    confidence: 98,
    aiRecommendation: 'Block source IP and isolate system',
    suggestedActions: ['Block IP', 'Isolate System', 'Alert SOC', 'Collect Logs'],
    riskScore: 9.2,
    timeDetected: '2 minutes ago',
  },
  {
    id: 2,
    threatId: 'THR-2024-002',
    threat: 'Malware: Suspicious File Detected',
    source: 'Downloads/document.exe',
    confidence: 94,
    aiRecommendation: 'Quarantine file and scan system',
    suggestedActions: ['Quarantine', 'Full System Scan', 'Sandbox Detonation', 'Notify User'],
    riskScore: 8.7,
    timeDetected: '15 minutes ago',
  },
  {
    id: 3,
    threatId: 'THR-2024-003',
    threat: 'Phishing: Suspicious Email',
    source: 'attacker@spoofed-domain.com',
    confidence: 87,
    aiRecommendation: 'Move to spam and block sender',
    suggestedActions: ['Block Sender', 'Move to Spam', 'Report to Security', 'User Training'],
    riskScore: 7.1,
    timeDetected: '1 hour ago',
  },
];

export function AIResponseConsole({ locale }: AIResponseConsoleProps) {
  const [selectedScenario, setSelectedScenario] = useState(responseScenarios[0]);
  const [executedActions, setExecutedActions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecuteAction = async (action: string) => {
    setIsProcessing(true);
    // Simulate action execution
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExecutedActions([...executedActions, action]);
    setIsProcessing(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 9) return 'text-destructive bg-destructive/10';
    if (score >= 7) return 'text-orange-500 bg-orange-500/10';
    return 'text-yellow-500 bg-yellow-500/10';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Threat List */}
      <div className="lg:col-span-1 space-y-3">
        <h3 className="font-semibold text-foreground">Active Threats</h3>
        {responseScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            className={`w-full text-left p-4 rounded-lg border transition ${
              selectedScenario.id === scenario.id
                ? 'bg-primary/20 border-primary/50'
                : 'bg-background border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{scenario.threatId}</span>
              <Badge className={`${getRiskColor(scenario.riskScore)} text-xs`}>
                {scenario.riskScore}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{scenario.threat}</p>
            <p className="text-xs text-muted-foreground mt-1">{scenario.timeDetected}</p>
          </button>
        ))}
      </div>

      {/* Response Details */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Threat Summary */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedScenario.threat}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedScenario.threatId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">AI Confidence</p>
                <p className={`text-2xl font-bold ${
                  selectedScenario.confidence >= 95 ? 'text-destructive' :
                  selectedScenario.confidence >= 85 ? 'text-orange-500' : 'text-yellow-500'
                }`}>
                  {selectedScenario.confidence}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Source/Target</p>
                <p className="text-sm text-foreground mt-1">{selectedScenario.source}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Detected</p>
                <p className="text-sm text-foreground mt-1">{selectedScenario.timeDetected}</p>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-4 bg-primary/10 border border-primary/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">AI Recommendation</p>
                <p className="text-foreground">{selectedScenario.aiRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Autonomous Response Actions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedScenario.suggestedActions.map((action) => {
                const isExecuted = executedActions.includes(action);
                return (
                  <Button
                    key={action}
                    onClick={() => handleExecuteAction(action)}
                    disabled={isExecuted || isProcessing}
                    className={`flex items-center gap-2 justify-center ${
                      isExecuted
                        ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                        : 'bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30'
                    }`}
                  >
                    {isExecuted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isProcessing ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    {action}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Action Status */}
          {executedActions.length > 0 && (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-500 mb-1">Actions Executed</p>
                  <p className="text-sm text-foreground">{executedActions.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
