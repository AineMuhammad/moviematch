import Link from 'next/link';
import { Suspense } from 'react';

import { GoogleButton } from '@/components/auth/google-button';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to start swiping on movies with your group.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>
        <Suspense>
          <SignInForm />
        </Suspense>
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
