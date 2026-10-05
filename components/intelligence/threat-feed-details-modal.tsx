'use client';

import { X, Copy, Check, ExternalLink, Shield, AlertTriangle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ThreatFeed {
  id: string;
  title: string;
  description: string;
  source: string;
  type: string;
  severity: string;
  confidence: number;
  timestamp: string;
  indicators: string[];
  mitigations: string[];
  references: string[];
  tlp: string;
}

interface ThreatFeedDetailsModalProps {
  feed: ThreatFeed;
  isOpen: boolean;
  onClose: () => void;
}

export function ThreatFeedDetailsModal({ feed, isOpen, onClose }: ThreatFeedDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'mitigations' | 'references'>('overview');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-primary/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-primary/10 p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{feed.title}</h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(feed.severity)}`}>
                {feed.severity.charAt(0).toUpperCase() + feed.severity.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTLPColor(feed.tlp)}`}>
                TLP: {feed.tlp.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-primary/10 px-6">
          <div className="flex gap-8">
            {['overview', 'indicators', 'mitigations', 'references'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{feed.description}</p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="text-foreground font-medium capitalize mt-1">{feed.type}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <p className="text-foreground font-medium mt-1">{feed.source}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <p className="text-foreground font-medium mt-1">{Math.round(feed.confidence * 100)}%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <p className="text-foreground font-medium mt-1">{feed.timestamp}</p>
                </div>
              </div>

              {/* Feed ID */}
              <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                <span className="text-sm text-muted-foreground">Feed ID</span>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-foreground font-mono text-sm">{feed.id}</code>
                  <button
                    onClick={() => handleCopy(feed.id, 0)}
                    className="p-1 hover:bg-primary/10 rounded transition"
                  >
                    {copiedIdx === 0 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'indicators' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">IOC (Indicators of Compromise)</h3>
              <p className="text-sm text-muted-foreground mb-4">Total indicators: {feed.indicators.length}</p>
              {feed.indicators.length > 0 ? (
                <div className="space-y-2">
                  {feed.indicators.map((indicator, idx) => (
                    <div key={idx} className="bg-background/50 rounded-lg p-4 border border-primary/10 flex items-center justify-between group hover:border-primary/30 transition">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Code className="w-5 h-5 text-primary flex-shrink-0" />
                        <code className="text-foreground font-mono text-sm break-all">{indicator}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(indicator, idx + 1)}
                        className="p-2 hover:bg-primary/10 rounded transition ml-2"
                      >
                        {copiedIdx === idx + 1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No indicators available</p>
              )}
            </div>
          )}

          {activeTab === 'mitigations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Recommended Mitigations
              </h3>
              {feed.mitigations.length > 0 ? (
                <div className="space-y-3">
                  {feed.mitigations.map((mitigation, idx) => (
                    <div key={idx} className="bg-background/50 rounded-lg p-4 border border-primary/10 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                        {idx + 1}
                      </div>
                      <p className="text-foreground">{mitigation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No mitigations available</p>
              )}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">References & Sources</h3>
              {feed.references.length > 0 ? (
                <div className="space-y-2">
                  {feed.references.map((reference, idx) => (
                    <a
                      key={idx}
                      href={reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-background/50 rounded-lg p-4 border border-primary/10 flex items-center justify-between group hover:border-primary/30 transition"
                    >
                      <span className="text-foreground text-sm group-hover:text-primary transition break-all">{reference}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No references available</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-background/50 border-t border-primary/10 px-6 py-4 flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
