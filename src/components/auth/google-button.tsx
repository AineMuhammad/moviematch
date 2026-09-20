'use client';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export function GoogleButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/' })}
    >
      Continue with Google
    </Button>
  );
}
