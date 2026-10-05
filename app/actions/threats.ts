'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { threats, auditLogs } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getThreats(limit: number = 100) {
  const userId = await getUserId()
  return db
    .select()
    .from(threats)
    .where(eq(threats.userId, userId))
    .orderBy(desc(threats.createdAt))
    .limit(limit)
}

export async function getThreatsBySeverity(severity: string, limit: number = 50) {
  const userId = await getUserId()
  return db
    .select()
    .from(threats)
    .where(and(eq(threats.userId, userId), eq(threats.severity, severity)))
    .orderBy(desc(threats.createdAt))
    .limit(limit)
}

export async function createThreat(data: {
  title: string
  description?: string
  severity: string
  type: string
  source?: string
  threatActors?: string
  mitreTactics?: string
}) {
  const userId = await getUserId()

  const result = await db
    .insert(threats)
    .values({
      userId,
      title: data.title,
      description: data.description,
      severity: data.severity,
      type: data.type,
      source: data.source,
      threatActors: data.threatActors,
      mitreTactics: data.mitreTactics,
      status: 'active',
    })
    .returning()

  // Log audit trail
  const headersList = await headers()
  await db.insert(auditLogs).values({
    userId,
    action: 'create_threat',
    resource: 'threats',
    resourceId: result[0].id.toString(),
    status: 'success',
    ipAddress: headersList.get('x-forwarded-for') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  })

  revalidatePath('/settings')
  return result[0]
}

export async function updateThreatStatus(threatId: number, status: string) {
  const userId = await getUserId()

  await db
    .update(threats)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(threats.id, threatId), eq(threats.userId, userId)))

  // Log audit trail
  const headersList = await headers()
  await db.insert(auditLogs).values({
    userId,
    action: 'update_threat_status',
    resource: 'threats',
    resourceId: threatId.toString(),
    status: 'success',
    ipAddress: headersList.get('x-forwarded-for') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  })

  revalidatePath('/settings')
}

export async function deleteThreat(threatId: number) {
  const userId = await getUserId()

  await db
    .delete(threats)
    .where(and(eq(threats.id, threatId), eq(threats.userId, userId)))

  // Log audit trail
  const headersList = await headers()
  await db.insert(auditLogs).values({
    userId,
    action: 'delete_threat',
    resource: 'threats',
    resourceId: threatId.toString(),
    status: 'success',
    ipAddress: headersList.get('x-forwarded-for') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  })

  revalidatePath('/settings')
}

export async function getThreatsStats() {
  const userId = await getUserId()
  const allThreats = await db
    .select()
    .from(threats)
    .where(eq(threats.userId, userId))

  return {
    total: allThreats.length,
    critical: allThreats.filter((t) => t.severity === 'critical').length,
    high: allThreats.filter((t) => t.severity === 'high').length,
    medium: allThreats.filter((t) => t.severity === 'medium').length,
    low: allThreats.filter((t) => t.severity === 'low').length,
    active: allThreats.filter((t) => t.status === 'active').length,
    resolved: allThreats.filter((t) => t.status === 'resolved').length,
  }
}
