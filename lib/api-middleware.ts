import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createErrorResponse,
  JWTPayload,
  verifyJWT,
  rateLimitConfig,
} from './auth-v2';

// Rate limiter store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Get client IP
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Rate limiting middleware
export function checkRateLimit(clientId: string, isAuthenticated: boolean) {
  const config = isAuthenticated
    ? rateLimitConfig.authenticated
    : rateLimitConfig.unauthenticated;

  const now = Date.now();
  const record = rateLimitStore.get(clientId);

  if (!record || record.resetTime < now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + config.window,
    });
    return { allowed: true, remaining: config.requests - 1 };
  }

  if (record.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return { allowed: true, remaining: config.requests - record.count };
}

// Authenticate request
export function authenticateRequest(request: NextRequest): {
  authenticated: boolean;
  payload: JWTPayload | null;
  error?: string;
} {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return { authenticated: false, payload: null };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      payload: null,
      error: 'Invalid authorization header format',
    };
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token);

  if (!payload) {
    return {
      authenticated: false,
      payload: null,
      error: 'Token verification failed',
    };
  }

  return { authenticated: true, payload };
}

// Request validation
export function validateRequestBody(body: any, requiredFields: string[]) {
  const missing = requiredFields.filter((field) => !body[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(', ')}`,
    };
  }
  return { valid: true };
}

// Request logging
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  console.log(
    `[${new Date().toISOString()}] ${method} ${path} - ${statusCode} - ${duration}ms${userId ? ` (user: ${userId})` : ''}`
  );
}

// CORS headers
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Security headers
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  };
}

// Request context
export interface RequestContext {
  requestId: string;
  clientIp: string;
  authenticated: boolean;
  userId?: string;
  userRole?: string;
  timestamp: number;
}

// Create request context
export function createRequestContext(
  request: NextRequest,
  auth: any
): RequestContext {
  return {
    requestId: uuidv4(),
    clientIp: getClientIp(request),
    authenticated: !!auth?.payload,
    userId: auth?.payload?.userId,
    userRole: auth?.payload?.role,
    timestamp: Date.now(),
  };
}

// Middleware wrapper for consistency
export async function withMiddleware(
  handler: (
    request: NextRequest,
    context: RequestContext
  ) => Promise<NextResponse>,
  options?: {
    requireAuth?: boolean;
    requiredPermission?: string;
    requiredFields?: string[];
  }
) {
  return async (request: NextRequest) => {
    const context = createRequestContext(request, null);

    try {
      // Check rate limit
      const rateLimit = checkRateLimit(context.clientIp, false);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          createErrorResponse(
            'RATE_LIMITED',
            'Too many requests. Please try again later.',
            context.requestId
          ),
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil(
                (rateLimit.resetTime! - Date.now()) / 1000
              ).toString(),
            },
          }
        );
      }

      // Authenticate if required
      if (options?.requireAuth) {
        const auth = authenticateRequest(request);
        if (!auth.authenticated) {
          return NextResponse.json(
            createErrorResponse(
              'UNAUTHORIZED',
              'Authentication required',
              context.requestId
            ),
            { status: 401 }
          );
        }
        context.authenticated = true;
        context.userId = auth.payload?.userId;
        context.userRole = auth.payload?.role;
      }

      // Validate request body if needed
      if (options?.requiredFields && request.method !== 'GET') {
        const body = await request.json();
        const validation = validateRequestBody(body, options.requiredFields);
        if (!validation.valid) {
          return NextResponse.json(
            createErrorResponse(
              'VALIDATION_ERROR',
              validation.error!,
              context.requestId
            ),
            { status: 400 }
          );
        }
      }

      const response = await handler(request, context);
      logRequest(
        request.method,
        request.nextUrl.pathname,
        response.status,
        Date.now() - context.timestamp,
        context.userId
      );

      return response;
    } catch (error) {
      console.error('[v0] Middleware error:', error);
      return NextResponse.json(
        createErrorResponse(
          'INTERNAL_ERROR',
          'Internal server error',
          context.requestId
        ),
        { status: 500 }
      );
    }
  };
}
