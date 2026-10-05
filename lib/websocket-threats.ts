/**
 * WebSocket Real-Time Threat Streaming
 * Streams live threat intelligence and security events
 */

import { v4 as uuidv4 } from 'uuid';

export interface ThreatStream {
  id: string;
  threatId: string;
  type: 'detection' | 'update' | 'resolved' | 'escalated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

export interface ThreatSubscription {
  id: string;
  clientId: string;
  filters: {
    severities?: string[];
    types?: string[];
    sources?: string[];
  };
  isActive: boolean;
  subscribedAt: Date;
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  action: 'created' | 'updated' | 'resolved' | 'escalated';
  status: string;
  details: string;
  timestamp: Date;
}

class WebSocketThreatManager {
  private static instance: WebSocketThreatManager;
  private subscriptions: Map<string, ThreatSubscription> = new Map();
  private threatStream: ThreatStream[] = [];
  private incidentUpdates: IncidentUpdate[] = [];
  private connectedClients: Set<string> = new Set();

  private constructor() {
    this.initializeStreamSimulation();
  }

  static getInstance(): WebSocketThreatManager {
    if (!WebSocketThreatManager.instance) {
      WebSocketThreatManager.instance = new WebSocketThreatManager();
    }
    return WebSocketThreatManager.instance;
  }

  private initializeStreamSimulation(): void {
    // Simulate threat stream for demo
    setInterval(() => {
      this.generateMockThreat();
    }, 10000); // New threat every 10 seconds
  }

  private generateMockThreat(): void {
    const threats = [
      { title: 'Port Scanning Detected', type: 'detection', severity: 'medium' },
      { title: 'SQL Injection Attempt', type: 'detection', severity: 'high' },
      { title: 'DDoS Attack Mitigated', type: 'resolved', severity: 'critical' },
      { title: 'Brute Force Attack', type: 'escalated', severity: 'high' },
      { title: 'Unauthorized Access', type: 'detection', severity: 'critical' },
      { title: 'Malware Signature Match', type: 'detection', severity: 'high' },
      { title: 'Suspicious API Call', type: 'update', severity: 'low' },
      { title: 'Certificate Expiration Warning', type: 'update', severity: 'medium' },
    ];

    const threat = threats[Math.floor(Math.random() * threats.length)];

    const stream: ThreatStream = {
      id: uuidv4(),
      threatId: `THREAT-${Date.now()}`,
      type: threat.type as any,
      severity: threat.severity as any,
      title: threat.title,
      description: `Real-time threat detected at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date(),
      source: ['IDS/IPS', 'WAF', 'SIEM', 'EDR'][Math.floor(Math.random() * 4)],
      metadata: {
        sourceIP: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        targetIP: '10.0.0.1',
        port: Math.floor(Math.random() * 65535),
        protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
      },
    };

    this.threatStream.push(stream);
    if (this.threatStream.length > 1000) {
      this.threatStream.shift();
    }

    // Broadcast to subscribers
    this.broadcastToSubscribers(stream);
  }

  createSubscription(
    clientId: string,
    filters: { severities?: string[]; types?: string[]; sources?: string[] }
  ): ThreatSubscription {
    const subscription: ThreatSubscription = {
      id: uuidv4(),
      clientId,
      filters,
      isActive: true,
      subscribedAt: new Date(),
    };

    this.subscriptions.set(subscription.id, subscription);
    this.connectedClients.add(clientId);

    return subscription;
  }

  cancelSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.isActive = false;
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  getActiveSubscriptions(): ThreatSubscription[] {
    return Array.from(this.subscriptions.values()).filter((s) => s.isActive);
  }

  broadcastToSubscribers(threat: ThreatStream): void {
    // Filter subscribers based on their preferences
    const activeSubscriptions = this.getActiveSubscriptions();
    activeSubscriptions.forEach((subscription) => {
      const matches =
        (!subscription.filters.severities || subscription.filters.severities.includes(threat.severity)) &&
        (!subscription.filters.types || subscription.filters.types.includes(threat.type)) &&
        (!subscription.filters.sources || subscription.filters.sources.includes(threat.source));

      if (matches) {
        // In a real implementation, this would send to the WebSocket client
        console.log(`[WebSocket] Broadcasting threat ${threat.id} to ${subscription.clientId}`);
      }
    });
  }

  recordIncidentUpdate(incidentId: string, action: string, status: string, details: string): IncidentUpdate {
    const update: IncidentUpdate = {
      id: uuidv4(),
      incidentId,
      action: action as any,
      status,
      details,
      timestamp: new Date(),
    };

    this.incidentUpdates.push(update);
    return update;
  }

  getIncidentUpdates(incidentId?: string, limit: number = 50): IncidentUpdate[] {
    let updates = this.incidentUpdates;

    if (incidentId) {
      updates = updates.filter((u) => u.incidentId === incidentId);
    }

    return updates.slice(-limit);
  }

  getThreatStream(limit: number = 100): ThreatStream[] {
    return this.threatStream.slice(-limit);
  }

  getThreatsByFilter(filter: {
    severity?: string;
    type?: string;
    source?: string;
    limit?: number;
  }): ThreatStream[] {
    let results = this.threatStream;

    if (filter.severity) {
      results = results.filter((t) => t.severity === filter.severity);
    }

    if (filter.type) {
      results = results.filter((t) => t.type === filter.type);
    }

    if (filter.source) {
      results = results.filter((t) => t.source === filter.source);
    }

    return results.slice(-(filter.limit || 100));
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getStreamStatistics(): {
    totalThreatsStreamed: number;
    activeSubscriptions: number;
    connectedClients: number;
    threatsBySeverity: Record<string, number>;
    threatsByType: Record<string, number>;
  } {
    const threatsBySeverity: Record<string, number> = {};
    const threatsByType: Record<string, number> = {};

    this.threatStream.forEach((threat) => {
      threatsBySeverity[threat.severity] = (threatsBySeverity[threat.severity] || 0) + 1;
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
    });

    return {
      totalThreatsStreamed: this.threatStream.length,
      activeSubscriptions: this.getActiveSubscriptions().length,
      connectedClients: this.getConnectedClientsCount(),
      threatsBySeverity,
      threatsByType,
    };
  }

  // Server-Sent Events (SSE) compatible format
  generateSSEMessage(threat: ThreatStream): string {
    return `data: ${JSON.stringify(threat)}\n\n`;
  }

  // Generate sample WebSocket message for client
  generateWebSocketMessage(threat: ThreatStream): {
    type: string;
    payload: ThreatStream;
    timestamp: string;
  } {
    return {
      type: 'THREAT_DETECTED',
      payload: threat,
      timestamp: new Date().toISOString(),
    };
  }
}

export const wsThreatsManager = WebSocketThreatManager.getInstance();
