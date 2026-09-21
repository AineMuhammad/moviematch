import { discoverMovies } from '@/lib/tmdb/queries';
import type { TmdbMovie } from '@/lib/tmdb/types';

const DECK_PAGES = 3;

export type RoomFilters = {
  genreFilter: number | null;
  region: string | null;
};

/**
 * Every member fetches the deck with the same room filters, so TMDB's (roughly
 * stable, popularity-sorted) discover results give everyone the same ordered
 * list without us having to persist a movie list per room.
 */
export async function getRoomMovieDeck({ genreFilter, region }: RoomFilters): Promise<TmdbMovie[]> {
  const pages = await Promise.all(
    Array.from({ length: DECK_PAGES }, (_, i) =>
      discoverMovies({ page: i + 1, genreId: genreFilter ?? undefined, region }),
    ),
  );

  const seen = new Set<number>();
  const movies: TmdbMovie[] = [];
  for (const page of pages) {
    for (const movie of page.results) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id);
        movies.push(movie);
      }
    }
  }

  return movies;
}
