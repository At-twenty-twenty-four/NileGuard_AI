/**
 * Threat Intelligence Integration Layer
 * Integrates with OSINT sources:
 * - VirusTotal (malware/URL scanning)
 * - SHODAN (exposed services)
 * - AlienVault OTX (threat feeds)
 * - STIX/TAXII feeds
 */

export interface ThreatIndicator {
  type: 'ipv4' | 'domain' | 'hash' | 'email' | 'url';
  value: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  source: string;
  lastSeen?: Date;
}

export interface MalwareAnalysis {
  hash: string;
  detectionRate: number; // 0-100
  vendors: Record<string, string>; // vendor -> detection name
  fileType?: string;
  fileSize?: number;
  tags?: string[];
}

export interface DomainRiskAnalysis {
  domain: string;
  reputation: number; // 0-100, lower is worse
  registrationDate?: Date;
  categories: string[];
  resolves_to?: string[];
  lastResolved?: Date;
}

// API Keys from environment
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
const ALIENVALUT_OTX_KEY = process.env.ALIENVALUT_OTX_KEY;

/**
 * VirusTotal API Integration
 * Provides file hash reputation and URL scanning
 */
export class VirusTotalIntegration {
  private apiKey: string;
  private baseUrl = 'https://www.virustotal.com/api/v3';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || VIRUSTOTAL_API_KEY || '';
  }

  async analyzeMalware(hash: string): Promise<MalwareAnalysis | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}/files/${hash}`, {
        method: 'GET',
        headers: {
          'x-apikey': this.apiKey,
        },
      });

      if (!response.ok) return null;

      const data: any = await response.json();
      const attributes = data.data?.attributes || {};

      return {
        hash,
        detectionRate:
          (attributes.last_analysis_stats?.malicious || 0) /
          (attributes.last_analysis_stats?.undetected +
            attributes.last_analysis_stats?.malicious +
            attributes.last_analysis_stats?.suspicious +
            attributes.last_analysis_stats?.undetected || 1),
        vendors: attributes.last_analysis_results || {},
        fileType: attributes.type_description,
        fileSize: attributes.size,
        tags: attributes.tags || [],
      };
    } catch (error) {
      console.error('[v0] VirusTotal API error:', error);
      return null;
    }
  }

  async analyzeUrl(url: string): Promise<DomainRiskAnalysis | null> {
    if (!this.apiKey) return null;

    try {
      const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
      const response = await fetch(`${this.baseUrl}/urls/${urlId}`, {
        method: 'GET',
        headers: {
          'x-apikey': this.apiKey,
        },
      });

      if (!response.ok) return null;

      const data: any = await response.json();
      const attributes = data.data?.attributes || {};

      return {
        domain: new URL(url).hostname || url,
        reputation:
          100 -
          ((attributes.last_analysis_stats?.malicious || 0) *
            100) /
            (attributes.last_analysis_stats?.total || 1),
        categories: attributes.categories || [],
      };
    } catch (error) {
      console.error('[v0] VirusTotal URL analysis error:', error);
      return null;
    }
  }
}

/**
 * SHODAN Integration
 * Provides IoT and exposed service discovery
 */
export class ShodanIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.shodan.io';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || SHODAN_API_KEY || '';
  }

  async searchExposedServices(query: string): Promise<any[]> {
    if (!this.apiKey) return [];

    try {
      const response = await fetch(
        `${this.baseUrl}/shodan/host/search?query=${encodeURIComponent(query)}&key=${this.apiKey}`
      );

      if (!response.ok) return [];

      const data: any = await response.json();
      return data.matches || [];
    } catch (error) {
      console.error('[v0] SHODAN API error:', error);
      return [];
    }
  }

  async getHostInfo(ip: string): Promise<any> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/shodan/host/${ip}?key=${this.apiKey}`
      );

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.error('[v0] SHODAN host lookup error:', error);
      return null;
    }
  }
}

/**
 * AlienVault OTX Integration
 * Provides open-source threat intelligence
 */
export class AlienVaultOTXIntegration {
  private apiKey: string;
  private baseUrl = 'https://otx.alienvault.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ALIENVALUT_OTX_KEY || '';
  }

  async getIPReputation(ip: string): Promise<ThreatIndicator | null> {
    try {
      const endpoint = this.apiKey
        ? `${this.baseUrl}/indicators/IPv4/${ip}?limit=100`
        : `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`;

      const response = await fetch(endpoint, {
        headers: this.apiKey
          ? {
              'X-OTX-API-KEY': this.apiKey,
            }
          : {},
      });

      if (!response.ok) return null;

      const data: any = await response.json();

      return {
        type: 'ipv4',
        value: ip,
        confidence: data.reputation || data.abuseConfidenceScore || 0,
        severity: this.getSeverityLevel(data.reputation || data.abuseConfidenceScore),
        source: 'AlienVault OTX',
        lastSeen: new Date(),
      };
    } catch (error) {
      console.error('[v0] AlienVault OTX error:', error);
      return null;
    }
  }

  async getDomainReputation(domain: string): Promise<DomainRiskAnalysis | null> {
    try {
      const response = await fetch(`${this.baseUrl}/indicators/domain/${domain}`);

      if (!response.ok) return null;

      const data: any = await response.json();

      return {
        domain,
        reputation: 100 - (data.reputation || 0),
        categories: data.alexa_rank ? ['high_traffic'] : [],
        lastResolved: new Date(),
      };
    } catch (error) {
      console.error('[v0] AlienVault domain lookup error:', error);
      return null;
    }
  }

  private getSeverityLevel(score: number): 'critical' | 'high' | 'medium' | 'low' | 'info' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'info';
  }
}

/**
 * STIX Feed Ingestion
 * Supports STIX 2.1 threat intelligence feeds
 */
export class STIXFeedIngestor {
  async ingestSTIXBundle(stixBundle: any): Promise<ThreatIndicator[]> {
    const indicators: ThreatIndicator[] = [];

    try {
      const objects = stixBundle.objects || [];

      for (const obj of objects) {
        if (obj.type === 'indicator') {
          const indicator = this.parseSTIXIndicator(obj);
          if (indicator) indicators.push(indicator);
        }
      }
    } catch (error) {
      console.error('[v0] STIX ingestion error:', error);
    }

    return indicators;
  }

  private parseSTIXIndicator(obj: any): ThreatIndicator | null {
    const pattern = obj.pattern || '';

    let type: ThreatIndicator['type'] = 'ipv4';
    let value = '';

    if (pattern.includes('ipv4-addr')) type = 'ipv4';
    else if (pattern.includes('domain-name')) type = 'domain';
    else if (pattern.includes('file:hashes')) type = 'hash';
    else if (pattern.includes('email-addr')) type = 'email';
    else if (pattern.includes('url:value')) type = 'url';

    const match = pattern.match(/'([^']+)'/);
    value = match ? match[1] : '';

    if (!value) return null;

    return {
      type,
      value,
      confidence: obj.confidence || 50,
      severity: (obj.labels?.[0] || 'medium') as any,
      source: 'STIX Feed',
    };
  }
}

/**
 * Unified Threat Intelligence API
 * Orchestrates multiple TI sources
 */
export class ThreatIntelligenceAPI {
  private vt: VirusTotalIntegration;
  private shodan: ShodanIntegration;
  private otx: AlienVaultOTXIntegration;
  private stix: STIXFeedIngestor;

  constructor() {
    this.vt = new VirusTotalIntegration();
    this.shodan = new ShodanIntegration();
    this.otx = new AlienVaultOTXIntegration();
    this.stix = new STIXFeedIngestor();
  }

  async enrichIndicator(indicator: ThreatIndicator): Promise<ThreatIndicator> {
    switch (indicator.type) {
      case 'ipv4':
        const ipRep = await this.otx.getIPReputation(indicator.value);
        return ipRep || indicator;

      case 'domain':
        const domainRep = await this.otx.getDomainReputation(indicator.value);
        return domainRep
          ? {
              ...indicator,
              confidence: 100 - domainRep.reputation,
            }
          : indicator;

      case 'hash':
        const malware = await this.vt.analyzeMalware(indicator.value);
        return malware
          ? {
              ...indicator,
              confidence: malware.detectionRate * 100,
            }
          : indicator;

      case 'url':
        const urlAnalysis = await this.vt.analyzeUrl(indicator.value);
        return urlAnalysis
          ? {
              ...indicator,
              confidence: 100 - urlAnalysis.reputation,
            }
          : indicator;

      default:
        return indicator;
    }
  }

  async searchThreatIntel(query: string, type: string) {
    const results: any = {};

    if (type === 'exposed_services') {
      results.shodan = await this.shodan.searchExposedServices(query);
    }

    return results;
  }
}

// Export singleton
export const threatIntelAPI = new ThreatIntelligenceAPI();
