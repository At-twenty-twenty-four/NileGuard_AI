import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('better-auth.session_token');

    return Response.json({ success: true });
  } catch (error) {
    console.error('Sign-out error:', error);
    return Response.json(
      { error: 'An error occurred during sign-out' },
      { status: 500 }
    );
  }
}
