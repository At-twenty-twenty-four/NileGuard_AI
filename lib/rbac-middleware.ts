import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export type UserRole = 'admin' | 'analyst' | 'officer' | 'responder' | 'viewer'

// Role-based permissions mapping
const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'view_dashboard',
    'view_compliance',
    'view_threats',
    'view_audit',
    'manage_users',
    'manage_settings',
    'export_data',
  ],
  analyst: [
    'view_dashboard',
    'view_compliance',
    'view_threats',
    'view_audit',
    'analyze_threats',
    'export_data',
  ],
  officer: ['view_compliance', 'view_audit', 'export_data', 'generate_reports'],
  responder: ['view_threats', 'update_threats', 'view_audit'],
  viewer: ['view_dashboard', 'view_threats', 'view_compliance'],
}

export async function checkUserRole() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return null
  }

  // Keep roles server-controlled. The seeded demo account is the local administrator;
  // every other account remains least-privilege by default until a server-side role
  // assignment is added.
  const isDemoAdmin = session.user.email.toLowerCase() === 'demo@ethioshield.test'
  const metadataRole = session.user.metadata?.role as UserRole | undefined
  const role: UserRole = isDemoAdmin ? 'admin' : (metadataRole || 'viewer')
  return { userId: session.user.id, role, user: session.user }
}

export async function requireRole(requiredRoles: UserRole[]) {
  const userAuth = await checkUserRole()

  if (!userAuth) {
    throw new Error('Unauthorized: No session')
  }

  if (!requiredRoles.includes(userAuth.role)) {
    throw new Error(`Forbidden: Requires one of ${requiredRoles.join(', ')} role`)
  }

  return userAuth
}

export async function hasPermission(permission: string): Promise<boolean> {
  const userAuth = await checkUserRole()

  if (!userAuth) {
    return false
  }

  const role = userAuth.role as UserRole
  return rolePermissions[role].includes(permission)
}

export async function canAccessPage(page: string): Promise<boolean> {
  const permissionMap: Record<string, string> = {
    '/dashboard': 'view_dashboard',
    '/settings': 'manage_settings',
    '/compliance': 'view_compliance',
    '/threats': 'view_threats',
    '/audit': 'view_audit',
  }

  const requiredPermission = permissionMap[page]
  if (!requiredPermission) return true // Public pages

  return await hasPermission(requiredPermission)
}
