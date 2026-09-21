import useSWR from 'swr';

export type RoomState = {
  memberCount: number;
  votedMemberCount: number;
  status: 'open' | 'expired';
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
