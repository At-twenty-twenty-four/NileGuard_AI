'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDemoUser = useCallback(async () => {
    setIsSeeding(true);
    setError('');

    try {
      // Populate demo credentials and auto-sign in
      setEmail('test@ethioshield.com');
      setPassword('password123');
      
      // Simulate a small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger sign in
      const endpoint = '/api/auth/sign-in';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@ethioshield.com', 
          password: 'password123' 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to sign in');
        setIsSeeding(false);
        return;
      }

      // Signal successful login
      sessionStorage.setItem('ethioshield_logged_in', 'true');
      setIsSeeding(false);
      
      // Redirect to dashboard
      router.push('/threats');
      router.refresh();
    } catch (err) {
      setError('An error occurred while signing in.');
      setIsSeeding(false);
    }
  }, [router]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/sign-up' : '/api/auth/sign-in';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Authentication failed');
        setIsLoading(false);
        return;
      }

      // Signal successful login
      sessionStorage.setItem('ethioshield_logged_in', 'true');
      
      // Call the callback to update parent component
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }, [isSignUp, email, password, onLoginSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-primary/20 rounded-lg mr-3">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">EthioShield</h1>
          </div>

          <p className="text-center text-muted-foreground mb-8 text-sm">
            Cyber Threat Intelligence Platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive/50 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="ml-2 text-primary hover:text-primary/80 font-medium transition"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-background/50 rounded-lg border border-primary/10">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo credentials: test@ethioshield.com / password123
            </p>
            <Button
              type="button"
              onClick={handleSeedDemoUser}
              disabled={isSeeding || isLoading}
              className="w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 text-xs font-medium py-1"
            >
              {isSeeding ? 'Creating Demo Account...' : 'Create Demo Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
