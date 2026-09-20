'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinRoom, type RoomActionState } from '@/lib/actions/rooms';

const initialState: RoomActionState = {};

export function JoinRoomForm({ defaultCode }: { defaultCode?: string }) {
  const [state, formAction, isPending] = useActionState(joinRoom, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Room code</Label>
        <Input
          id="code"
          name="code"
          placeholder="ABC123"
          maxLength={6}
          autoCapitalize="characters"
          defaultValue={defaultCode}
          className="text-center text-lg tracking-[0.3em] uppercase"
          required
        />
      </div>

      {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Joining…' : 'Join room'}
      </Button>
    </form>
  );
}
