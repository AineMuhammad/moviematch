'use client';

import { Progress } from '@/components/ui/progress';
import { useRoomState } from '@/hooks/use-room-state';

export function RoomProgress({ code }: { code: string }) {
  const { data } = useRoomState(code);

  if (!data) return null;

  const percent = data.memberCount === 0 ? 0 : (data.votedMemberCount / data.memberCount) * 100;

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-center text-xs">
        {data.votedMemberCount} of {data.memberCount}{' '}
        {data.memberCount === 1 ? 'member has' : 'members have'} started swiping
      </p>
      <Progress value={percent} />
    </div>
  );
}
