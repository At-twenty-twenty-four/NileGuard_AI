/**
 * Role-Based Access Control (RBAC) System
 * Enterprise-grade permission management
 */

import { v4 as uuidv4 } from 'uuid';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  lastLogin: Date | null;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

export interface RBACPolicy {
  id: string;
  name: string;
  description: string;
  conditions: Record<string, any>;
  effect: 'allow' | 'deny';
}

class RBACManager {
  private static instance: RBACManager;
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private users: Map<string, User> = new Map();
  private policies: Map<string, RBACPolicy> = new Map();
  private auditLog: any[] = [];

  private constructor() {
    this.initializeDefaultRoles();
  }

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager();
    }
    return RBACManager.instance;
  }

  private initializeDefaultRoles(): void {
    // Define default permissions
    const allPermissions = [
      {
        resource: 'threats',
        action: 'create' as const,
        description: 'Create threat intelligence entries',
      },
      {
        resource: 'threats',
        action: 'read' as const,
        description: 'View threat intelligence',
      },
      {
        resource: 'threats',
        action: 'update' as const,
        description: 'Update threat information',
      },
      { resource: 'threats', action: 'delete' as const, description: 'Delete threats' },
      {
        resource: 'incidents',
        action: 'create' as const,
        description: 'Create security incidents',
      },
      {
        resource: 'incidents',
        action: 'read' as const,
        description: 'View incidents',
      },
      {
        resource: 'incidents',
        action: 'update' as const,
        description: 'Update incidents',
      },
      {
        resource: 'incidents',
        action: 'delete' as const,
        description: 'Delete incidents',
      },
      {
        resource: 'compliance',
        action: 'read' as const,
        description: 'View compliance reports',
      },
      {
        resource: 'compliance',
        action: 'update' as const,
        description: 'Update compliance controls',
      },
      {
        resource: 'audit',
        action: 'read' as const,
        description: 'View audit logs',
      },
      {
        resource: 'users',
        action: 'create' as const,
        description: 'Create users',
      },
      {
        resource: 'users',
        action: 'read' as const,
        description: 'View users',
      },
      {
        resource: 'users',
        action: 'update' as const,
        description: 'Update users',
      },
      {
        resource: 'users',
        action: 'delete' as const,
        description: 'Delete users',
      },
      {
        resource: 'roles',
        action: 'create' as const,
        description: 'Create roles',
      },
      {
        resource: 'roles',
        action: 'read' as const,
        description: 'View roles',
      },
      {
        resource: 'roles',
        action: 'update' as const,
        description: 'Update roles',
      },
      {
        resource: 'roles',
        action: 'delete' as const,
        description: 'Delete roles',
      },
    ];

    allPermissions.forEach((perm) => {
      const permission: Permission = {
        id: uuidv4(),
        name: `${perm.resource}.${perm.action}`,
        resource: perm.resource,
        action: perm.action,
        description: perm.description,
      };
      this.permissions.set(permission.id, permission);
    });

    // Create default roles
    const roles = [
      {
        name: 'Administrator',
        description: 'Full system access',
        permissionFilter: (p: Permission) => true, // All permissions
      },
      {
        name: 'Security Analyst',
        description: 'View and manage threats/incidents',
        permissionFilter: (p: Permission) =>
          ['threats', 'incidents'].includes(p.resource) && p.action !== 'delete',
      },
      {
        name: 'Compliance Officer',
        description: 'Manage compliance and audit logs',
        permissionFilter: (p: Permission) =>
          ['compliance', 'audit', 'roles'].includes(p.resource) && p.action === 'read',
      },
      {
        name: 'Incident Responder',
        description: 'Create and manage incidents',
        permissionFilter: (p: Permission) =>
          ['incidents', 'threats'].includes(p.resource) && ['create', 'read', 'update'].includes(p.action),
      },
      {
        name: 'Viewer',
        description: 'Read-only access',
        permissionFilter: (p: Permission) => p.action === 'read',
      },
    ];

    roles.forEach((roleConfig) => {
      const rolePermissions = Array.from(this.permissions.values()).filter(
        roleConfig.permissionFilter
      );

      const role: Role = {
        id: uuidv4(),
        name: roleConfig.name,
        description: roleConfig.description,
        permissions: rolePermissions,
        createdAt: new Date(),
        status: 'active',
      };

      this.roles.set(role.id, role);
    });
  }

  createUser(username: string, email: string, roleIds: string[]): User {
    const roles = roleIds.map((id) => this.roles.get(id)).filter((r) => r !== undefined) as Role[];

    // Collect all permissions from roles
    const permissionSet = new Set<string>();
    roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        permissionSet.add(perm.id);
      });
    });

    const permissions = Array.from(permissionSet)
      .map((id) => this.permissions.get(id))
      .filter((p) => p !== undefined) as Permission[];

    const user: User = {
      id: uuidv4(),
      username,
      email,
      roles,
      permissions,
      lastLogin: null,
      status: 'active',
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    this.logAuditEvent('user_created', user.id, { username, email, roles: roleIds });

    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  updateUserRoles(userId: string, roleIds: string[]): User | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const roles = roleIds.map((id) => this.roles.get(id)).filter((r) => r !== undefined) as Role[];

    const permissionSet = new Set<string>();
    roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        permissionSet.add(perm.id);
      });
    });

    user.roles = roles;
    user.permissions = Array.from(permissionSet)
      .map((id) => this.permissions.get(id))
      .filter((p) => p !== undefined) as Permission[];

    this.logAuditEvent('user_roles_updated', userId, { roles: roleIds });

    return user;
  }

  canUserAccess(userId: string, resource: string, action: string): boolean {
    const user = this.users.get(userId);
    if (!user || user.status !== 'active') return false;

    const hasPermission = user.permissions.some(
      (p) => p.resource === resource && p.action === action
    );

    this.logAuditEvent('access_check', userId, {
      resource,
      action,
      granted: hasPermission,
    });

    return hasPermission;
  }

  checkMultiplePermissions(
    userId: string,
    checks: Array<{ resource: string; action: string }>
  ): boolean {
    return checks.every((check) => this.canUserAccess(userId, check.resource, check.action));
  }

  createRole(name: string, description: string, permissionIds: string[]): Role {
    const permissions = permissionIds
      .map((id) => this.permissions.get(id))
      .filter((p) => p !== undefined) as Permission[];

    const role: Role = {
      id: uuidv4(),
      name,
      description,
      permissions,
      createdAt: new Date(),
      status: 'active',
    };

    this.roles.set(role.id, role);
    this.logAuditEvent('role_created', role.id, { name, description, permissions: permissionIds });

    return role;
  }

  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  createPolicy(
    name: string,
    description: string,
    conditions: Record<string, any>,
    effect: 'allow' | 'deny'
  ): RBACPolicy {
    const policy: RBACPolicy = {
      id: uuidv4(),
      name,
      description,
      conditions,
      effect,
    };

    this.policies.set(policy.id, policy);
    this.logAuditEvent('policy_created', policy.id, { name, description, effect });

    return policy;
  }

  private logAuditEvent(eventType: string, subject: string, details: any): void {
    this.auditLog.push({
      id: uuidv4(),
      eventType,
      subject,
      details,
      timestamp: new Date(),
    });

    // Keep only last 10000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog.shift();
    }
  }

  getAuditLog(limit: number = 100): any[] {
    return this.auditLog.slice(-limit);
  }

  generateAccessReport(userId: string): {
    user: User | undefined;
    permissions: Permission[];
    roles: Role[];
    report: string;
  } {
    const user = this.users.get(userId);
    if (!user) {
      return {
        user: undefined,
        permissions: [],
        roles: [],
        report: 'User not found',
      };
    }

    let report = `Access Report for ${user.username}\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `ASSIGNED ROLES\n`;
    report += `==============\n`;
    user.roles.forEach((role) => {
      report += `- ${role.name}: ${role.description}\n`;
    });

    report += `\nASSIGNED PERMISSIONS\n`;
    report += `===================\n`;
    user.permissions.forEach((perm) => {
      report += `- ${perm.name}: ${perm.description}\n`;
    });

    return {
      user,
      permissions: user.permissions,
      roles: user.roles,
      report,
    };
  }

  exportAsJSON(): string {
    return JSON.stringify(
      {
        users: Array.from(this.users.values()),
        roles: Array.from(this.roles.values()),
        permissions: Array.from(this.permissions.values()),
        policies: Array.from(this.policies.values()),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

export const rbacManager = RBACManager.getInstance();
