import useSWR from 'swr';

export type RoomMatch = {
  tmdbMovieId: number;
  matchedAt: string;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  trailerKey: string | null;
};

export type RoomState = {
  memberCount: number;
  votedMemberCount: number;
  status: 'open' | 'expired';
  match: RoomMatch | null;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to load room state');
    return res.json() as Promise<RoomState>;
  });

export function useRoomState(code: string) {
  return useSWR<RoomState>(`/api/rooms/${code}/state`, fetcher, {
    refreshInterval: 3000,
  });
}
