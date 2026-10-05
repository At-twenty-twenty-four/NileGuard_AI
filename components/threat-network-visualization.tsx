'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Network, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NetworkNode {
  id: string;
  label: string;
  type: 'source' | 'target' | 'intermediary';
  severity: 'low' | 'medium' | 'high' | 'critical';
  threats: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  threatType: string;
}

interface ThreatNetworkVisualizationProps {
  title?: string;
  threatsCount?: number;
}

export function ThreatNetworkVisualization({
  title = 'Threat Network Analysis',
  threatsCount = 42,
}: ThreatNetworkVisualizationProps) {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  useEffect(() => {
    // Generate mock threat network
    const mockNodes: NetworkNode[] = [
      {
        id: 'attacker-1',
        label: 'Attacker 192.168.1.100',
        type: 'source',
        severity: 'critical',
        threats: 15,
      },
      {
        id: 'compromised-1',
        label: 'Compromised System 10.0.0.50',
        type: 'intermediary',
        severity: 'high',
        threats: 8,
      },
      {
        id: 'target-1',
        label: 'Target Database Server',
        type: 'target',
        severity: 'critical',
        threats: 12,
      },
      {
        id: 'attacker-2',
        label: 'Attacker 203.0.113.42',
        type: 'source',
        severity: 'high',
        threats: 6,
      },
      {
        id: 'target-2',
        label: 'Target Web Server',
        type: 'target',
        severity: 'high',
        threats: 7,
      },
      {
        id: 'intermediary-2',
        label: 'Botnet Node',
        type: 'intermediary',
        severity: 'critical',
        threats: 14,
      },
    ];

    const mockEdges: NetworkEdge[] = [
      { source: 'attacker-1', target: 'compromised-1', weight: 8, threatType: 'Exploitation' },
      { source: 'compromised-1', target: 'target-1', weight: 12, threatType: 'Data Exfiltration' },
      { source: 'attacker-2', target: 'intermediary-2', weight: 14, threatType: 'DDoS' },
      { source: 'intermediary-2', target: 'target-2', weight: 7, threatType: 'Attack Traffic' },
      { source: 'attacker-1', target: 'target-2', weight: 5, threatType: 'Reconnaissance' },
    ];

    setNodes(mockNodes);
    setEdges(mockEdges);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getNodeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'fill-red-600';
      case 'high':
        return 'fill-orange-600';
      case 'medium':
        return 'fill-yellow-600';
      default:
        return 'fill-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Network className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Real-time visualization of threat actor networks and attack paths
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-red-600">{threatsCount}</p>
          <p className="text-xs text-muted-foreground">Active Threats</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-orange-600">{nodes.length}</p>
          <p className="text-xs text-muted-foreground">Network Nodes</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-yellow-600">{edges.length}</p>
          <p className="text-xs text-muted-foreground">Attack Paths</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-green-600">87%</p>
          <p className="text-xs text-muted-foreground">Detection Rate</p>
        </div>
      </div>

      {/* SVG Network Diagram */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <svg
          width="100%"
          height="400"
          viewBox="0 0 800 400"
          className="bg-muted/10"
          style={{ minHeight: '400px' }}
        >
          {/* Draw edges */}
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const sourceIndex = nodes.indexOf(sourceNode);
            const targetIndex = nodes.indexOf(targetNode);
            const x1 = 100 + (sourceIndex % 2) * 300;
            const y1 = 80 + Math.floor(sourceIndex / 2) * 120;
            const x2 = 400 + (targetIndex % 2) * 200;
            const y2 = 80 + Math.floor(targetIndex / 2) * 120;

            return (
              <line
                key={`edge-${edge.source}-${edge.target}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={edge.weight > 10 ? '#dc2626' : '#ea580c'}
                strokeWidth={edge.weight > 10 ? 3 : 2}
                opacity={0.6}
                strokeDasharray={edge.weight > 10 ? '5,5' : '0'}
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, index) => {
            const x = 100 + (index % 2) * 300;
            const y = 80 + Math.floor(index / 2) * 120;
            const radius = node.severity === 'critical' ? 35 : 25;

            return (
              <g key={node.id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  className={getNodeColor(node.severity)}
                  opacity={selectedNode?.id === node.id ? 1 : 0.8}
                  style={{ transition: 'all 0.3s' }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 8}
                  fill="none"
                  stroke={node.severity === 'critical' ? '#dc2626' : '#ea580c'}
                  strokeWidth={selectedNode?.id === node.id ? 2 : 0}
                  opacity={0.3}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-xs font-bold fill-white"
                >
                  {node.threats}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nodes List */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Network Nodes
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`p-3 rounded-lg border cursor-pointer transition ${getSeverityColor(node.severity)} ${selectedNode?.id === node.id ? 'ring-2 ring-foreground' : ''}`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{node.label}</p>
                    <p className="text-xs">Type: {node.type}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {node.threats} threats
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Details */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Node Analysis
          </h4>
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected Node</p>
                <p className="text-lg font-semibold">{selectedNode.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <Badge className="capitalize mt-1">{selectedNode.severity}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Node Type</p>
                  <Badge variant="outline" className="capitalize mt-1">
                    {selectedNode.type}
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Related Threats</p>
                <div className="space-y-1">
                  {edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => (
                      <div key={`${edge.source}-${edge.target}`} className="text-xs">
                        <span className="font-medium">{edge.threatType}</span>
                        <span className="text-muted-foreground ml-2">(Weight: {edge.weight})</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Active threat detected. Recommend immediate action.</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Network className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Click on a node to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Attack Path Timeline */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Attack Path Timeline
        </h4>
        <div className="space-y-3">
          {[
            { time: '14:32:15', event: 'Initial Reconnaissance', severity: 'low' },
            { time: '14:45:22', event: 'Exploitation Attempt', severity: 'high' },
            { time: '14:56:08', event: 'Lateral Movement', severity: 'high' },
            { time: '15:12:41', event: 'Data Exfiltration Started', severity: 'critical' },
            { time: '15:18:03', event: 'Attack Blocked', severity: 'medium' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 w-3 h-3 rounded-full bg-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.time}</p>
                <p className="text-xs text-muted-foreground">{item.event}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs capitalize ${
                  item.severity === 'critical'
                    ? 'border-red-200 text-red-700'
                    : item.severity === 'high'
                      ? 'border-orange-200 text-orange-700'
                      : ''
                }`}
              >
                {item.severity}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
