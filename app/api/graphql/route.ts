import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { threats, complianceStatus, auditLogs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

interface GraphQLRequest {
  query: string
  variables?: Record<string, any>
}

interface GraphQLResponse {
  data?: any
  errors?: Array<{ message: string }>
}

// Simple GraphQL query parser
function parseQuery(query: string): { operation: string; field: string } {
  const match = query.match(/query\s*{\s*(\w+)\s*{/)
  if (match) {
    return { operation: 'query', field: match[1] }
  }
  return { operation: 'unknown', field: '' }
}

export async function POST(req: NextRequest): Promise<NextResponse<GraphQLResponse>> {
  try {
    // Verify authentication
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json(
        { errors: [{ message: 'Unauthorized' }] },
        { status: 401 },
      )
    }

    const userId = session.user.id
    const body = (await req.json()) as GraphQLRequest
    const { query } = body
    const { field } = parseQuery(query)

    // Route to appropriate resolver
    if (field === 'threats') {
      const allThreats = await db.select().from(threats).where(eq(threats.userId, userId))

      return NextResponse.json({
        data: {
          threats: allThreats.map((t) => ({
            id: t.id?.toString(),
            title: t.title,
            description: t.description,
            severity: t.severity,
            type: t.type,
            status: t.status,
            createdAt: t.createdAt,
          })),
        },
      })
    }

    if (field === 'compliance') {
      const compliance = await db
        .select()
        .from(complianceStatus)
        .where(eq(complianceStatus.userId, userId))

      return NextResponse.json({
        data: {
          compliance: compliance.map((c) => ({
            id: c.id?.toString(),
            framework: c.framework,
            controlId: c.controlId,
            controlName: c.controlName,
            status: c.status,
            percentage: c.percentage,
          })),
        },
      })
    }

    if (field === 'auditLogs') {
      const logs = await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(auditLogs.createdAt)
        .limit(100)

      return NextResponse.json({
        data: {
          auditLogs: logs.map((l) => ({
            id: l.id?.toString(),
            action: l.action,
            resource: l.resource,
            status: l.status,
            createdAt: l.createdAt,
          })),
        },
      })
    }

    return NextResponse.json({
      errors: [{ message: `Unknown query field: ${field}` }],
    })
  } catch (error) {
    console.error('GraphQL error:', error)
    return NextResponse.json(
      {
        errors: [
          {
            message: error instanceof Error ? error.message : 'Internal server error',
          },
        ],
      },
      { status: 500 },
    )
  }
}

export async function GET(): Promise<NextResponse<{ message: string }>> {
  return NextResponse.json({
    message: 'GraphQL endpoint. Send POST requests with query in body.',
  })
}
