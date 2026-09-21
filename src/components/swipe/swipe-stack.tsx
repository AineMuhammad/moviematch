'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { Heart, X } from 'lucide-react';

import { MovieCard } from '@/components/swipe/movie-card';
import { Button } from '@/components/ui/button';
import type { TmdbMovie } from '@/lib/tmdb/types';

const SWIPE_THRESHOLD = 100;
const VISIBLE_STACK_SIZE = 3;

export function SwipeStack({
  movies,
  onSwipe,
}: {
  movies: TmdbMovie[];
  onSwipe?: (movie: TmdbMovie, liked: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const controls = useAnimation();

  const current = movies[index];
  const upcoming = movies.slice(index + 1, index + VISIBLE_STACK_SIZE);

  async function handleSwipe(liked: boolean) {
    if (!current) return;
    await controls.start({
      x: liked ? 500 : -500,
      opacity: 0,
      rotate: liked ? 15 : -15,
      transition: { duration: 0.25 },
    });
    onSwipe?.(current, liked);
    setIndex((i) => i + 1);
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  }

  if (!current) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium">That&apos;s every movie in the deck.</p>
        <p className="text-sm">Wait for the rest of the group to finish swiping.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6">
      <div className="relative aspect-[2/3] w-full max-w-xs flex-1">
        {upcoming
          .slice()
          .reverse()
          .map((movie, i) => {
            const depth = upcoming.length - i;
            return (
              <div
                key={movie.id}
                className="absolute inset-0"
                style={{
                  transform: `scale(${1 - depth * 0.04}) translateY(${depth * 8}px)`,
                  zIndex: -depth,
                }}
              >
                <MovieCard movie={movie} />
              </div>
            );
          })}

        <motion.div
          key={current.id}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          animate={controls}
          onDragEnd={(_event, info) => {
            if (info.offset.x > SWIPE_THRESHOLD) {
              void handleSwipe(true);
            } else if (info.offset.x < -SWIPE_THRESHOLD) {
              void handleSwipe(false);
            } else {
              controls.start({ x: 0, rotate: 0, transition: { duration: 0.2 } });
            }
          }}
          whileDrag={{ rotate: 8 }}
        >
          <MovieCard movie={current} />
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          aria-label="Pass"
          className="size-14 rounded-full"
          onClick={() => handleSwipe(false)}
        >
          <X className="size-6" />
        </Button>
        <Button
          type="button"
          size="icon-lg"
          aria-label="Like"
          className="size-14 rounded-full"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="size-6" />
        </Button>
      </div>
    </div>
  );
}
