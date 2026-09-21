export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbGenreListResponse = {
  genres: TmdbGenre[];
};

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
};

export type TmdbMovieListResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type TmdbVideo = {
  id: string;
  key: string;
  name: string;
  site: 'YouTube' | 'Vimeo' | string;
  type: string;
  official: boolean;
};

export type TmdbVideoListResponse = {
  id: number;
  results: TmdbVideo[];
};
