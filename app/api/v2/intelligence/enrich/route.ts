import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createResponse,
  createErrorResponse,
  verifyJWT,
  hasPermission,
} from '@/lib/auth-v2';
import { threatIntelAPI, ThreatIndicator } from '@/lib/threat-intelligence';

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();

  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Missing or invalid authorization token',
          requestId
        ),
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        createErrorResponse('INVALID_TOKEN', 'Token verification failed', requestId),
        { status: 401 }
      );
    }

    if (!hasPermission(payload.role, 'intelligence.read')) {
      return NextResponse.json(
        createErrorResponse(
          'FORBIDDEN',
          'Insufficient permissions for this action',
          requestId
        ),
        { status: 403 }
      );
    }

    const body = await request.json();
    const { indicator } = body;

    if (!indicator || !indicator.type || !indicator.value) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing required fields: indicator.type, indicator.value',
          requestId
        ),
        { status: 400 }
      );
    }

    // Enrich indicator with threat intelligence
    const enrichedIndicator = await threatIntelAPI.enrichIndicator(indicator);

    const response = {
      original: indicator,
      enriched: enrichedIndicator,
      sources: ['VirusTotal', 'AlienVault OTX', 'SHODAN'],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(createResponse(response, requestId));
  } catch (error) {
    console.error('[v0] Error in POST /api/v2/intelligence/enrich:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while enriching the indicator',
        requestId
      ),
      { status: 500 }
    );
  }
}
