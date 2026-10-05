import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createResponse,
  createErrorResponse,
  verifyJWT,
  hasPermission,
} from '@/lib/auth-v2';
import { sentinelAIX, ThreatEvent } from '@/lib/sentinel-ai-x';

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

    if (!hasPermission(payload.role, 'response.read')) {
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
    const { threatEvent } = body;

    if (!threatEvent || !threatEvent.type || !threatEvent.severity) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing required threat event fields',
          requestId
        ),
        { status: 400 }
      );
    }

    // Create ThreatEvent object
    const event: ThreatEvent = {
      id: threatEvent.id || uuidv4(),
      type: threatEvent.type,
      severity: threatEvent.severity,
      sourceIp: threatEvent.sourceIp || 'unknown',
      targetSystem: threatEvent.targetSystem || 'unknown',
      timestamp: new Date(threatEvent.timestamp || Date.now()),
      metadata: threatEvent.metadata || {},
    };

    // Analyze with SentinelAI-X
    const analysis = await sentinelAIX.analyzeThreat(event);

    const response = {
      threatId: event.id,
      classification: analysis.classification,
      recommendations: analysis.recommendations,
      autoExecutedActions: analysis.autoActions,
      summary: {
        totalRecommendations: analysis.recommendations.length,
        autoExecutedCount: analysis.autoActions.length,
        highConfidenceActions: analysis.recommendations.filter((r) => r.confidenceScore > 0.85)
          .length,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(createResponse(response, requestId));
  } catch (error) {
    console.error('[v0] Error in POST /api/v2/response/analyze:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred while analyzing the threat',
        requestId
      ),
      { status: 500 }
    );
  }
}
