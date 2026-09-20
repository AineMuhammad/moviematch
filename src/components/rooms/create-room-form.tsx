'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createRoom, type RoomActionState } from '@/lib/actions/rooms';
import { ROOM_REGIONS, DEFAULT_ROOM_REGION } from '@/lib/rooms/regions';
import type { TmdbGenre } from '@/lib/tmdb/types';

const initialState: RoomActionState = {};

export function CreateRoomForm({ genres }: { genres: TmdbGenre[] }) {
  const [state, formAction, isPending] = useActionState(createRoom, initialState);

  const genreItems = Object.fromEntries(genres.map((genre) => [String(genre.id), genre.name]));
  const regionItems = Object.fromEntries(ROOM_REGIONS.map((region) => [region.code, region.label]));

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Room name</Label>
        <Input id="name" name="name" placeholder="Friday movie night" required maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genreId">Genre (optional)</Label>
        <Select name="genreId" items={genreItems}>
          <SelectTrigger id="genreId" className="w-full">
            <SelectValue placeholder="Any genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={String(genre.id)}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select name="region" items={regionItems} defaultValue={DEFAULT_ROOM_REGION}>
          <SelectTrigger id="region" className="w-full">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_REGIONS.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating…' : 'Create room'}
      </Button>
    </form>
  );
}
