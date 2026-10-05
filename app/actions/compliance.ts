'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { complianceStatus, auditLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getComplianceStatus(framework: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(complianceStatus)
    .where(and(eq(complianceStatus.userId, userId), eq(complianceStatus.framework, framework)))
}

export async function updateComplianceControl(
  framework: string,
  controlId: string,
  status: string,
  percentage: number,
) {
  const userId = await getUserId()
  
  await db
    .update(complianceStatus)
    .set({
      status,
      percentage: percentage.toString(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(complianceStatus.userId, userId),
        eq(complianceStatus.framework, framework),
        eq(complianceStatus.controlId, controlId),
      ),
    )

  // Log audit trail
  await logAuditTrail(userId, 'update_compliance', framework, controlId, 'success')
  revalidatePath('/settings')
}

export async function logAuditTrail(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  status: string = 'success',
) {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip')
  const userAgent = headersList.get('user-agent')

  await db.insert(auditLogs).values({
    userId,
    action,
    resource,
    resourceId,
    status,
    ipAddress: ipAddress || 'unknown',
    userAgent: userAgent || 'unknown',
  })
}

export async function getAuditLogs(limit: number = 50) {
  const userId = await getUserId()
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(auditLogs.createdAt)
    .limit(limit)
}

export async function initializeComplianceControls(userId: string, framework: string) {
  // Initialize ISO 27001 controls
  if (framework === 'iso27001') {
    const controls = [
      { id: 'A.5.1', name: 'Policies for information security' },
      { id: 'A.5.2', name: 'Information security roles and responsibilities' },
      { id: 'A.6.3', name: 'Segregation of duties' },
      { id: 'A.7.1', name: 'Prior to user access' },
      { id: 'A.7.2', name: 'User access provisioning' },
      { id: 'A.8.1', name: 'User endpoint devices' },
      { id: 'A.10.1', name: 'Cryptography controls' },
      { id: 'A.12.1', name: 'Operations facilities' },
      { id: 'A.12.2', name: 'System hardening' },
      { id: 'A.14.1', name: 'Information security requirements for development' },
    ]

    for (const control of controls) {
      await db.insert(complianceStatus).values({
        userId,
        framework,
        controlId: control.id,
        controlName: control.name,
        status: 'planned',
        percentage: 0,
      })
    }
  }
}
