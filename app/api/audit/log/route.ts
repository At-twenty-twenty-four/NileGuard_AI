import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';

const RUST_SECURITY_SERVICE = process.env.RUST_SECURITY_SERVICE_URL || 'http://localhost:8001';

interface AuditLogRequest {
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditLogRequest = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Send to Rust security service for cryptographic signing
    const securityResponse = await fetch(`${RUST_SECURITY_SERVICE}/audit/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: body.action,
        resource_type: body.resourceType,
        resource_id: body.resourceId,
        user_id: null, // TODO: Get from session
        ip_address: ipAddress,
        changes: body.changes || {},
      }),
    });

    if (!securityResponse.ok) {
      throw new Error(`Security service error: ${securityResponse.statusText}`);
    }

    const signedLog = await securityResponse.json();

    // Store in database
    const logEntry = await db.insert(auditLogs).values({
      userId: null, // TODO: Get from session
      action: body.action,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      changes: body.changes || {},
      ipAddress,
      userAgent,
    }).returning();

    return NextResponse.json({
      success: true,
      logId: logEntry[0].id,
      timestamp: logEntry[0].createdAt,
    });
  } catch (error) {
    console.error('Audit logging error:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication and authorization
    const logs = await db.query.auditLogs.findMany({
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}
