'use server';

import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { ensureRoomMembership, isRoomJoinable } from '@/lib/rooms/queries';
import { generateRoomCode } from '@/lib/rooms/code';
import { DEFAULT_ROOM_REGION } from '@/lib/rooms/regions';
import { requireUser } from '@/lib/session';
import { createRoomSchema, joinRoomSchema } from '@/lib/validations/rooms';

export type RoomActionState = {
  error?: string;
};

const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 10;

async function generateUniqueRoomCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateRoomCode();
    const existing = await prisma.room.findUnique({ where: { code }, select: { id: true } });
    if (!existing) return code;
  }
  throw new Error('Could not generate a unique room code');
}

export async function createRoom(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  const user = await requireUser();

  const parsed = createRoomSchema.safeParse({
    name: formData.get('name'),
    genreId: formData.get('genreId') || undefined,
    region: formData.get('region') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { name, genreId, region } = parsed.data;
  const code = await generateUniqueRoomCode();

  const room = await prisma.room.create({
    data: {
      code,
      name,
      hostId: user.id,
      genreFilter: genreId ?? null,
      region: region ?? DEFAULT_ROOM_REGION,
      expiresAt: new Date(Date.now() + ROOM_TTL_MS),
      members: { create: { userId: user.id } },
    },
  });

  redirect(`/rooms/${room.code}`);
}

export async function joinRoom(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  const user = await requireUser();

  const parsed = joinRoomSchema.safeParse({ code: formData.get('code') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Enter a valid room code' };
  }

  const room = await prisma.room.findUnique({ where: { code: parsed.data.code } });
  if (!room) {
    return { error: 'No room found with that code' };
  }
  if (!isRoomJoinable(room)) {
    return { error: 'This room has expired' };
  }

  await ensureRoomMembership(room.id, user.id);

  redirect(`/rooms/${room.code}`);
}

export async function endRoom(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  const user = await requireUser();
  const roomId = String(formData.get('roomId'));

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.hostId !== user.id) {
    return { error: 'Only the host can end this room' };
  }

  await prisma.room.update({ where: { id: roomId }, data: { status: 'expired' } });

  redirect(`/rooms/${room.code}`);
}

export async function leaveRoom(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  const user = await requireUser();
  const roomId = String(formData.get('roomId'));

  await prisma.roomMember.deleteMany({ where: { roomId, userId: user.id } });

  redirect('/');
}
