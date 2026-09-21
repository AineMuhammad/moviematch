import { Progress } from '@/components/ui/progress';
import type { RoomState } from '@/hooks/use-room-state';

export function RoomProgress({ state }: { state: RoomState }) {
  const percent = state.memberCount === 0 ? 0 : (state.votedMemberCount / state.memberCount) * 100;

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-center text-xs">
        {state.votedMemberCount} of {state.memberCount}{' '}
        {state.memberCount === 1 ? 'member has' : 'members have'} started swiping
      </p>
      <Progress value={percent} />
    </div>
  );
}
