'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function RoomError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg font-medium">Something went wrong loading this room.</p>
      <p className="text-muted-foreground max-w-sm text-sm">
        This can happen if TMDB is briefly unavailable. Try again in a moment.
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
