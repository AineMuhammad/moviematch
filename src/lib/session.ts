import { redirect } from 'next/navigation';

import { auth } from '@/auth';

/**
 * Every server component/action/route handler behind a protected page calls this
 * instead of relying on middleware — keeps auth checks colocated with the routes
 * that need them and sidesteps any Auth.js/proxy.ts middleware interop questions.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  return session.user;
}
