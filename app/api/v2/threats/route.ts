import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createResponse,
  createErrorResponse,
  JWTPayload,
  verifyJWT,
  hasPermission,
} from '@/lib/auth-v2';

// Helper to get auth from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Helper to validate auth
async function validateRequest(
  request: NextRequest,
  requiredPermission: string
) {
  const token = getAuthToken(request);
  if (!token) {
    return {
      valid: false,
      error: createErrorResponse(
        'UNAUTHORIZED',
        'Missing or invalid authorization token',
        uuidv4()
      ),
    };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return {
      valid: false,
      error: createErrorResponse(
        'INVALID_TOKEN',
        'Token verification failed',
        uuidv4()
      ),
    };
  }

  if (!hasPermission(payload.role, requiredPermission)) {
    return {
      valid: false,
      error: createErrorResponse(
        'FORBIDDEN',
        'Insufficient permissions for this action',
        uuidv4()
      ),
    };
  }

  return { valid: true, payload };
}

export async function GET(request: NextRequest) {
  const requestId = uuidv4();

  try {
    const auth = await validateRequest(request, 'threat.read');
    if (!auth.valid) {
      return NextResponse.json(auth.error, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';
    const severity = url.searchParams.get('severity');
    const status = url.searchParams.get('status');

    // Build mock response (in production, query database)
    const mockThreats = [
      {
        id: uuidv4(),
        title: 'Possible APT28 Spear Phishing Campaign',
        alertType: 'phishing',
        severity: 'high',
        status: 'investigating',
        sourceIp: '192.168.1.100',
        targetSystem: 'Email Gateway',
        confidenceScore: 87.5,
        detectionMethod: 'phishing_filter',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Lateral Movement Detected - RDP Protocol',
        alertType: 'intrusion',
        severity: 'critical',
        status: 'open',
        sourceIp: '10.0.1.50',
        targetSystem: 'Domain Controller',
        confidenceScore: 94.2,
        detectionMethod: 'intrusion_detection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const data = {
      threats: mockThreats.slice((page - 1) * limit, page * limit),
      pagination: {
        total: mockThreats.length,
        page,
        limit,
        pages: Math.ceil(mockThreats.length / limit),
      },
    };

    return NextResponse.json(createResponse(data, requestId));
  } catch (error) {
    console.error('[v0] Error in GET /api/v2/threats:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while processing your request',
        requestId,
        error instanceof Error ? error.message : undefined
      ),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();

  try {
    const auth = await validateRequest(request, 'threat.create');
    if (!auth.valid) {
      return NextResponse.json(auth.error, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.alertType || !body.severity) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing required fields: title, alertType, severity',
          requestId
        ),
        { status: 400 }
      );
    }

    // Create new threat (in production, save to database)
    const newThreat = {
      id: uuidv4(),
      ...body,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: auth.payload.userId,
    };

    return NextResponse.json(createResponse(newThreat, requestId), {
      status: 201,
    });
  } catch (error) {
    console.error('[v0] Error in POST /api/v2/threats:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while processing your request',
        requestId,
        error instanceof Error ? error.message : undefined
      ),
      { status: 500 }
    );
  }
}
