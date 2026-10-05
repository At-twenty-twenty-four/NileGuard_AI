import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard/dashboard'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect('/sign-in')
  }

  return <Dashboard />
}
