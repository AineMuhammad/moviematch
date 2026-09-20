import Link from 'next/link';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">🎬 MovieMatch</h1>
      <p className="text-muted-foreground max-w-md">
        Create a room, swipe on movies with your group, and get an instant match the moment everyone
        agrees.
      </p>

      {session?.user ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm">
            Signed in as <span className="font-medium">{session.user.email}</span>
          </p>
          <div className="flex gap-3">
            <Button render={<Link href="/rooms/new" />} nativeButton={false}>
              Create a room
            </Button>
            <Button render={<Link href="/rooms/join" />} nativeButton={false} variant="outline">
              Join a room
            </Button>
          </div>
          <SignOutButton />
        </div>
      ) : (
        <div className="flex gap-3">
          <Button render={<Link href="/sign-up" />} nativeButton={false}>
            Get started
          </Button>
          <Button render={<Link href="/sign-in" />} nativeButton={false} variant="outline">
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
}
