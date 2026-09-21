'use client';

import { toast } from 'sonner';

import { RoomProgress } from '@/components/rooms/room-progress';
import { SwipeStack } from '@/components/swipe/swipe-stack';
import type { TmdbMovie } from '@/lib/tmdb/types';

export function SwipeScreen({ code, movies }: { code: string; movies: TmdbMovie[] }) {
  async function handleSwipe(movie: TmdbMovie, liked: boolean) {
    try {
      const res = await fetch(`/api/rooms/${code}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbMovieId: movie.id, liked }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Could not save your vote. Check your connection.');
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <RoomProgress code={code} />
      <SwipeStack movies={movies} onSwipe={handleSwipe} />
    </div>
  );
}
