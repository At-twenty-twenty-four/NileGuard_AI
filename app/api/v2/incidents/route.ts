import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createResponse,
  createErrorResponse,
  verifyJWT,
  hasPermission,
} from '@/lib/auth-v2';

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

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
    const auth = await validateRequest(request, 'incident.read');
    if (!auth.valid) {
      return NextResponse.json(auth.error, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);

    // Mock incidents
    const mockIncidents = [
      {
        id: uuidv4(),
        title: 'Advanced Persistent Threat - APT28 Campaign',
        description: 'Coordinated attack targeting financial sector',
        severity: 'critical',
        status: 'investigating',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: null,
        affectedSystems: ['Email Gateway', 'Domain Controller', 'File Server'],
        assignedTo: 'Security Team',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Malware Distribution Campaign',
        description: 'Trojan-based malware detected in email attachments',
        severity: 'high',
        status: 'contained',
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 3600000).toISOString(),
        affectedSystems: ['Workstation-42', 'Workstation-156'],
        assignedTo: 'Malware Analysis Team',
        createdAt: new Date().toISOString(),
      },
    ];

    const data = {
      incidents: mockIncidents.slice((page - 1) * limit, page * limit),
      pagination: {
        total: mockIncidents.length,
        page,
        limit,
        pages: Math.ceil(mockIncidents.length / limit),
      },
    };

    return NextResponse.json(createResponse(data, requestId));
  } catch (error) {
    console.error('[v0] Error in GET /api/v2/incidents:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while processing your request',
        requestId
      ),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();

  try {
    const auth = await validateRequest(request, 'incident.create');
    if (!auth.valid) {
      return NextResponse.json(auth.error, { status: 401 });
    }

    const body = await request.json();

    if (!body.title || !body.severity) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing required fields: title, severity',
          requestId
        ),
        { status: 400 }
      );
    }

    const newIncident = {
      id: uuidv4(),
      ...body,
      status: 'open',
      startTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: auth.payload.userId,
    };

    return NextResponse.json(createResponse(newIncident, requestId), {
      status: 201,
    });
  } catch (error) {
    console.error('[v0] Error in POST /api/v2/incidents:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while processing your request',
        requestId
      ),
      { status: 500 }
    );
  }
}
