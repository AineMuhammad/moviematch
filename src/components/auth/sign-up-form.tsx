'use client';

import { signIn } from 'next-auth/react';
import { useActionState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser, type RegisterState } from '@/lib/actions/auth';

const initialState: RegisterState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  // Captured at submit time so a later browser autofill can't change what we sign in with.
  const submittedCredentials = useRef<{ email: string; password: string } | null>(null);

  useEffect(() => {
    if (state.error || !submittedCredentials.current) return;

    const { email, password } = submittedCredentials.current;
    submittedCredentials.current = null;
    void signIn('credentials', { email, password, callbackUrl: '/' });
  }, [state]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        submittedCredentials.current = {
          email: String(formData.get('email')),
          password: String(formData.get('password')),
        };
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
