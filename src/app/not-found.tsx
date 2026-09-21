import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        That link doesn&apos;t point anywhere — the room may have expired, or the URL is off.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Back home
      </Button>
    </div>
  );
}
