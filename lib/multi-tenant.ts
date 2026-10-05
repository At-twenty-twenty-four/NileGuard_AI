/**
 * Multi-Tenant Architecture
 * Tenant isolation with data partitioning and access control
 */

import { v4 as uuidv4 } from 'uuid';

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  industry: string;
  maxUsers: number;
  maxThreats: number;
  plan: 'starter' | 'professional' | 'enterprise';
  features: string[];
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: Date;
}

export interface TenantData {
  id: string;
  tenantId: string;
  dataType: string;
  content: any;
  createdAt: Date;
  lastModified: Date;
}

export interface TenantApiKey {
  id: string;
  tenantId: string;
  key: string;
  lastUsed: Date | null;
  status: 'active' | 'revoked';
  createdAt: Date;
}

class MultiTenantManager {
  private static instance: MultiTenantManager;
  private tenants: Map<string, TenantConfig> = new Map();
  private tenantUsers: Map<string, TenantUser[]> = new Map();
  private tenantData: Map<string, TenantData[]> = new Map();
  private apiKeys: Map<string, TenantApiKey[]> = new Map();
  private tenantMetrics: Map<string, any> = new Map();
  private auditLog: Map<string, any[]> = new Map();

  private constructor() {
    this.initializeSampleTenants();
  }

  static getInstance(): MultiTenantManager {
    if (!MultiTenantManager.instance) {
      MultiTenantManager.instance = new MultiTenantManager();
    }
    return MultiTenantManager.instance;
  }

  private initializeSampleTenants(): void {
    const sampleTenants = [
      {
        name: 'TechCorp Inc',
        domain: 'techcorp.ethioshield.io',
        industry: 'Technology',
        plan: 'enterprise' as const,
      },
      {
        name: 'FinanceSecure Ltd',
        domain: 'financesecure.ethioshield.io',
        industry: 'Financial Services',
        plan: 'enterprise' as const,
      },
      {
        name: 'HealthNet Solutions',
        domain: 'healthnet.ethioshield.io',
        industry: 'Healthcare',
        plan: 'professional' as const,
      },
    ];

    sampleTenants.forEach((tenant) => {
      this.createTenant(tenant.name, tenant.domain, tenant.industry, tenant.plan);
    });
  }

  createTenant(
    name: string,
    domain: string,
    industry: string,
    plan: 'starter' | 'professional' | 'enterprise'
  ): TenantConfig {
    const planConfig = {
      starter: { maxUsers: 5, maxThreats: 1000, features: ['basic-analytics', 'threat-detection'] },
      professional: {
        maxUsers: 50,
        maxThreats: 100000,
        features: [
          'advanced-analytics',
          'threat-detection',
          'incident-response',
          'compliance-reports',
        ],
      },
      enterprise: {
        maxUsers: 500,
        maxThreats: 1000000,
        features: [
          'advanced-analytics',
          'threat-detection',
          'incident-response',
          'compliance-reports',
          'soc2-audit',
          'gdpr-compliance',
          'custom-integration',
          'api-access',
        ],
      },
    };

    const config = planConfig[plan];

    const tenant: TenantConfig = {
      id: uuidv4(),
      name,
      domain,
      industry,
      maxUsers: config.maxUsers,
      maxThreats: config.maxThreats,
      plan,
      features: config.features,
      status: 'active',
      createdAt: new Date(),
    };

    this.tenants.set(tenant.id, tenant);
    this.tenantUsers.set(tenant.id, []);
    this.tenantData.set(tenant.id, []);
    this.apiKeys.set(tenant.id, []);
    this.auditLog.set(tenant.id, []);

    this.logTenantAudit(tenant.id, 'tenant_created', { name, domain, industry, plan });

    return tenant;
  }

  getTenant(tenantId: string): TenantConfig | undefined {
    return this.tenants.get(tenantId);
  }

  getTenantByDomain(domain: string): TenantConfig | undefined {
    for (const tenant of this.tenants.values()) {
      if (tenant.domain === domain) {
        return tenant;
      }
    }
    return undefined;
  }

  getAllTenants(): TenantConfig[] {
    return Array.from(this.tenants.values());
  }

  createTenantUser(
    tenantId: string,
    username: string,
    email: string,
    role: string
  ): TenantUser | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const currentUserCount = (this.tenantUsers.get(tenantId) || []).length;
    if (currentUserCount >= tenant.maxUsers) {
      throw new Error(`Max users (${tenant.maxUsers}) exceeded for tenant ${tenantId}`);
    }

    const user: TenantUser = {
      id: uuidv4(),
      tenantId,
      username,
      email,
      role,
      permissions: this.getRolePermissions(role),
      createdAt: new Date(),
    };

    if (!this.tenantUsers.has(tenantId)) {
      this.tenantUsers.set(tenantId, []);
    }

    this.tenantUsers.get(tenantId)!.push(user);
    this.logTenantAudit(tenantId, 'user_created', { username, email, role });

    return user;
  }

  getTenantUsers(tenantId: string): TenantUser[] {
    return this.tenantUsers.get(tenantId) || [];
  }

  storeData(tenantId: string, dataType: string, content: any): TenantData {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const data: TenantData = {
      id: uuidv4(),
      tenantId,
      dataType,
      content,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    if (!this.tenantData.has(tenantId)) {
      this.tenantData.set(tenantId, []);
    }

    this.tenantData.get(tenantId)!.push(data);
    this.logTenantAudit(tenantId, 'data_stored', { dataType, dataId: data.id });

    return data;
  }

  getTenantData(tenantId: string, dataType?: string): TenantData[] {
    let data = this.tenantData.get(tenantId) || [];

    if (dataType) {
      data = data.filter((d) => d.dataType === dataType);
    }

    return data;
  }

  createApiKey(tenantId: string): TenantApiKey {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    if (!tenant.features.includes('api-access')) {
      throw new Error(`API access not available in ${tenant.plan} plan`);
    }

    const key = `sk_${Buffer.from(uuidv4()).toString('base64').replace(/[^a-zA-Z0-9]/g, '')}`;

    const apiKey: TenantApiKey = {
      id: uuidv4(),
      tenantId,
      key,
      lastUsed: null,
      status: 'active',
      createdAt: new Date(),
    };

    if (!this.apiKeys.has(tenantId)) {
      this.apiKeys.set(tenantId, []);
    }

    this.apiKeys.get(tenantId)!.push(apiKey);
    this.logTenantAudit(tenantId, 'api_key_created', { keyId: apiKey.id });

    return apiKey;
  }

  validateApiKey(key: string): { valid: boolean; tenantId?: string } {
    for (const [tenantId, keys] of this.apiKeys.entries()) {
      const apiKey = keys.find((k) => k.key === key && k.status === 'active');
      if (apiKey) {
        apiKey.lastUsed = new Date();
        return { valid: true, tenantId };
      }
    }
    return { valid: false };
  }

  revokeApiKey(tenantId: string, keyId: string): boolean {
    const keys = this.apiKeys.get(tenantId);
    if (!keys) return false;

    const apiKey = keys.find((k) => k.id === keyId);
    if (apiKey) {
      apiKey.status = 'revoked';
      this.logTenantAudit(tenantId, 'api_key_revoked', { keyId });
      return true;
    }

    return false;
  }

  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      admin: [
        'read:threats',
        'write:threats',
        'read:incidents',
        'write:incidents',
        'read:users',
        'write:users',
        'read:settings',
        'write:settings',
      ],
      analyst: ['read:threats', 'write:threats', 'read:incidents', 'write:incidents'],
      viewer: ['read:threats', 'read:incidents'],
    };

    return rolePermissions[role] || [];
  }

  private logTenantAudit(tenantId: string, eventType: string, details: any): void {
    if (!this.auditLog.has(tenantId)) {
      this.auditLog.set(tenantId, []);
    }

    this.auditLog.get(tenantId)!.push({
      id: uuidv4(),
      eventType,
      details,
      timestamp: new Date(),
    });
  }

  getTenantAuditLog(tenantId: string, limit: number = 100): any[] {
    const log = this.auditLog.get(tenantId) || [];
    return log.slice(-limit);
  }

  getTenantMetrics(tenantId: string): {
    userId: string;
    activeUsers: number;
    storageUsed: number;
    apiCallsLast24h: number;
    status: string;
  } {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const users = this.tenantUsers.get(tenantId) || [];
    const data = this.tenantData.get(tenantId) || [];

    return {
      userId: tenantId,
      activeUsers: users.length,
      storageUsed: JSON.stringify(data).length,
      apiCallsLast24h: Math.floor(Math.random() * 1000) + 100,
      status: tenant.status,
    };
  }

  upgradeTenant(tenantId: string, newPlan: 'starter' | 'professional' | 'enterprise'): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;

    const planConfig = {
      starter: { maxUsers: 5, maxThreats: 1000 },
      professional: { maxUsers: 50, maxThreats: 100000 },
      enterprise: { maxUsers: 500, maxThreats: 1000000 },
    };

    const config = planConfig[newPlan];
    tenant.plan = newPlan;
    tenant.maxUsers = config.maxUsers;
    tenant.maxThreats = config.maxThreats;

    this.logTenantAudit(tenantId, 'plan_upgraded', { newPlan });

    return true;
  }

  exportTenantData(tenantId: string): string {
    const tenant = this.tenants.get(tenantId);
    const users = this.tenantUsers.get(tenantId);
    const data = this.tenantData.get(tenantId);

    return JSON.stringify(
      {
        tenant,
        users,
        data,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  generateTenantReport(tenantId: string): string {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return 'Tenant not found';

    const metrics = this.getTenantMetrics(tenantId);
    const auditLog = this.getTenantAuditLog(tenantId, 10);

    let report = `Tenant Report\n`;
    report += `==============\n`;
    report += `Name: ${tenant.name}\n`;
    report += `Domain: ${tenant.domain}\n`;
    report += `Plan: ${tenant.plan}\n`;
    report += `Status: ${tenant.status}\n`;
    report += `Created: ${tenant.createdAt.toISOString()}\n\n`;

    report += `METRICS\n`;
    report += `=======\n`;
    report += `Active Users: ${metrics.activeUsers}\n`;
    report += `Storage Used: ${metrics.storageUsed} bytes\n`;
    report += `API Calls (24h): ${metrics.apiCallsLast24h}\n\n`;

    report += `RECENT ACTIVITY\n`;
    report += `===============\n`;
    auditLog.forEach((log) => {
      report += `${log.timestamp.toISOString()} - ${log.eventType}\n`;
    });

    return report;
  }
}

export const multiTenantManager = MultiTenantManager.getInstance();
