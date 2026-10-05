import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  createResponse,
  createErrorResponse,
  createSessionTokens,
  UserRole,
} from '@/lib/auth-v2';

export async function POST(request: NextRequest) {
  const requestId = uuidv4();

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Email and password are required',
          requestId
        ),
        { status: 400 }
      );
    }

    // Demo credentials
    const isDemoUser =
      email === 'test@ethioshield.com' && password === 'password123';

    if (isDemoUser) {
      const userId = 'demo-user-001';
      const tokens = createSessionTokens(userId, email, UserRole.ANALYST);

      const response = {
        user: {
          id: userId,
          email,
          name: 'Demo User',
          role: UserRole.ANALYST,
        },
        tokens,
      };

      return NextResponse.json(createResponse(response, requestId));
    }

    return NextResponse.json(
      createErrorResponse(
        'INVALID_CREDENTIALS',
        'Invalid email or password',
        requestId
      ),
      { status: 401 }
    );
  } catch (error) {
    console.error('[v0] Error in POST /api/v2/auth/login:', error);
    return NextResponse.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'An error occurred during authentication',
        requestId
      ),
      { status: 500 }
    );
  }
}
