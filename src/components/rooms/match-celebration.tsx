import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { RoomMatch } from '@/hooks/use-room-state';
import { tmdbImageUrl } from '@/lib/tmdb/image';

export function MatchCelebration({ code, match }: { code: string; match: RoomMatch }) {
  const posterUrl = tmdbImageUrl(match.posterPath, 'w500');

  return (
    <div className="flex flex-1 flex-col items-center gap-6 py-6 text-center">
      <div>
        <p className="text-3xl">🎉</p>
        <h1 className="text-2xl font-bold tracking-tight">It&apos;s a match!</h1>
        <p className="text-muted-foreground">Everyone in the room liked this one.</p>
      </div>

      {match.trailerKey ? (
        <div className="aspect-video w-full max-w-sm overflow-hidden rounded-xl shadow-lg">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${match.trailerKey}`}
            title={`${match.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : posterUrl ? (
        <div className="relative aspect-[2/3] w-full max-w-[220px]">
          <Image
            src={posterUrl}
            alt={match.title}
            fill
            sizes="220px"
            className="rounded-xl object-cover shadow-lg"
          />
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold">
          {match.title}{' '}
          <span className="text-muted-foreground">★ {match.voteAverage.toFixed(1)}</span>
        </h2>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">{match.overview}</p>
      </div>

      <Button render={<Link href={`/rooms/${code}`} />} nativeButton={false}>
        Back to room
      </Button>
    </div>
  );
}
