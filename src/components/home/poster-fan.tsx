import Image from 'next/image';

import { tmdbImageUrl } from '@/lib/tmdb/image';
import type { TmdbMovie } from '@/lib/tmdb/types';

const ROTATIONS = [-8, 4, -2, 8, -5];

export function PosterFan({ posters }: { posters: TmdbMovie[] }) {
  return (
    <div className="relative hidden h-80 items-center justify-center lg:flex">
      {posters.map((movie, index) => {
        const posterUrl = tmdbImageUrl(movie.poster_path, 'w342');
        if (!posterUrl) return null;
        const rotation = ROTATIONS[index % ROTATIONS.length];
        const offset = (index - (posters.length - 1) / 2) * 56;

        return (
          <div
            key={movie.id}
            className="ring-border/50 absolute aspect-[2/3] w-40 overflow-hidden rounded-xl shadow-xl ring-1 transition-transform duration-300 hover:z-20 hover:scale-105"
            style={{ transform: `translateX(${offset}px) rotate(${rotation}deg)`, zIndex: index }}
          >
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="160px"
              className="object-cover"
              // Only 5 images, all above the fold — priority-load the whole
              // fan rather than guessing which one paints as the LCP element.
              priority
            />
          </div>
        );
      })}
    </div>
  );
}
