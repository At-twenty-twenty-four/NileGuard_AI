import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/rbac-middleware'
import { SettingsPageClient } from '@/components/settings/settings-page-client'

export default async function SettingsPage() {
  // Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/sign-in')
  }

  // Check RBAC permission
  const canManageSettings = await hasPermission('manage_settings')
  if (!canManageSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access settings.</p>
        </div>
      </div>
    )
  }

  return <SettingsPageClient />
}
