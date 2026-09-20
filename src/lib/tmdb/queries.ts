import { tmdbFetch } from '@/lib/tmdb/client';
import type { TmdbGenreListResponse, TmdbMovieListResponse } from '@/lib/tmdb/types';

export type DiscoverMoviesParams = {
  page?: number;
  genreId?: number | null;
  region?: string | null;
};

export function getPopularMovies(page = 1) {
  return tmdbFetch<TmdbMovieListResponse>('/movie/popular', { page, include_adult: false });
}

export function getTrendingMovies(window: 'day' | 'week' = 'week', page = 1) {
  return tmdbFetch<TmdbMovieListResponse>(`/trending/movie/${window}`, { page });
}

export function discoverMovies({ page = 1, genreId, region }: DiscoverMoviesParams = {}) {
  return tmdbFetch<TmdbMovieListResponse>('/discover/movie', {
    page,
    include_adult: false,
    sort_by: 'popularity.desc',
    with_genres: genreId ?? undefined,
    watch_region: region ?? undefined,
    with_watch_monetization_types: region ? 'flatrate' : undefined,
  });
}

export function getMovieGenres() {
  return tmdbFetch<TmdbGenreListResponse>('/genre/movie/list', {}, { revalidateSeconds: 86400 });
}
