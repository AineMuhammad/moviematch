import Image from 'next/image';

import { tmdbImageUrl } from '@/lib/tmdb/image';
import type { TmdbMovie } from '@/lib/tmdb/types';

export function MovieCard({ movie }: { movie: TmdbMovie }) {
  const posterUrl = tmdbImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <div className="bg-card ring-foreground/10 flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-xl ring-1">
      <div className="bg-muted relative aspect-[2/3] w-full shrink-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
            draggable={false}
            priority
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            No poster available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg leading-tight font-semibold">
            {movie.title} {year ? <span className="text-muted-foreground">({year})</span> : null}
          </h2>
          <span className="bg-secondary text-secondary-foreground shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-4 text-sm">
          {movie.overview || 'No description available.'}
        </p>
      </div>
    </div>
  );
}
