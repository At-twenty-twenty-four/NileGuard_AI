export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, validate demo credentials
    if (email === 'test@ethioshield.com' && password === 'password123') {
      return Response.json({ 
        success: true,
        message: 'Demo user signed in successfully'
      });
    }

    // For other users, reject for now (not implemented)
    return Response.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[v0] Sign-in error:', error);
    return Response.json(
      { error: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}
