import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get session from Better Auth
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // For demo, accept any session
    return Response.json({
      authenticated: true,
      user: { email: 'user@example.com' },
    });
  } catch (error) {
    return Response.json({ error: 'Failed to get session' }, { status: 500 });
  }
}
