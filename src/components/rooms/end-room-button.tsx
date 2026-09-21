'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { endRoom, type RoomActionState } from '@/lib/actions/rooms';

const initialState: RoomActionState = {};

export function EndRoomButton({ roomId }: { roomId: string }) {
  const [state, formAction, isPending] = useActionState(endRoom, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-1">
      <input type="hidden" name="roomId" value={roomId} />
      <Button type="submit" variant="destructive" disabled={isPending} className="w-full">
        {isPending ? 'Ending…' : 'End room'}
      </Button>
      {state.error ? <p className="text-destructive text-xs">{state.error}</p> : null}
    </form>
  );
}
