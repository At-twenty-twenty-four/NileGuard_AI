import jwt from 'jsonwebtoken';
import { hash, verify } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// User roles for RBAC
export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  MANAGER = 'manager',
  VIEWER = 'viewer',
  API_BOT = 'api_bot',
}

// Permission mapping
export const rolePermissions: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'threat.create',
    'threat.read',
    'threat.update',
    'threat.delete',
    'incident.manage',
    'users.manage',
    'settings.manage',
    'audit.read',
  ],
  [UserRole.ANALYST]: [
    'threat.read',
    'threat.update',
    'threat.create',
    'incident.create',
    'incident.read',
    'intelligence.read',
    'response.execute',
  ],
  [UserRole.MANAGER]: [
    'threat.read',
    'incident.read',
    'incident.update',
    'users.read',
    'audit.read',
    'response.read',
  ],
  [UserRole.VIEWER]: ['threat.read', 'incident.read', 'intelligence.read'],
  [UserRole.API_BOT]: [
    'threat.create',
    'threat.read',
    'incident.create',
    'incident.read',
    'response.log',
  ],
};

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

// Session Token
export interface SessionToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

const JWT_SECRET = process.env.NEON_AUTH_COOKIE_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return verify(password, hashedPassword);
}

// Generate JWT token
export function generateJWT(
  userId: string,
  email: string,
  role: UserRole
): JWTPayload & { token: string } {
  const payload: JWTPayload = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    iss: 'ethioshield',
    sub: userId,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return { ...payload, token };
}

// Generate refresh token
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

// Verify JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    console.error('[v0] JWT verification failed:', error);
    return null;
  }
}

// Check user permission
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

// Create session tokens
export function createSessionTokens(
  userId: string,
  email: string,
  role: UserRole
): SessionToken {
  const tokenData = generateJWT(userId, email, role);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken: tokenData.token,
    refreshToken,
    expiresIn: 86400,
    tokenType: 'Bearer',
  };
}

// Validate API key for bot/service account
export function validateApiKey(apiKey: string): boolean {
  // Implementation would check API key against database
  // This is a placeholder
  return apiKey.startsWith('sk_');
}

// Rate limiting helper
export const rateLimitConfig = {
  authenticated: {
    requests: 100,
    window: 60000, // 1 minute
  },
  unauthenticated: {
    requests: 10,
    window: 60000,
  },
};

// Standard API error response
export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

// Standard API success response
export interface APISuccess<T> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
  meta?: {
    version: string;
    timestamp: string;
  };
}

export type APIResponse<T = any> = APISuccess<T> | APIError;

// Create standardized response
export function createResponse<T>(
  data: T,
  requestId: string
): APISuccess<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId,
    meta: {
      version: 'v2.0.0',
      timestamp: new Date().toISOString(),
    },
  };
}

// Create standardized error response
export function createErrorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: any
): APIError {
  return {
    success: false,
    error: { code, message, details },
    timestamp: new Date().toISOString(),
    requestId,
  };
}
