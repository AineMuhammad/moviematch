import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkForMatch } from '@/lib/rooms/matches';
import { getRoomForApi, isRoomJoinable } from '@/lib/rooms/queries';
import { castVoteSchema } from '@/lib/validations/votes';

export async function POST(request: Request, { params }: RouteContext<'/api/rooms/[code]/votes'>) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code } = await params;
  const room = await getRoomForApi(code.toUpperCase());
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const isMember = room.members.some((member) => member.userId === session.user.id);
  if (!isMember) {
    return NextResponse.json({ error: 'You are not a member of this room' }, { status: 403 });
  }
  if (!isRoomJoinable(room)) {
    return NextResponse.json({ error: 'This room has expired' }, { status: 409 });
  }

  const body = await request.json().catch(() => null);
  const parsed = castVoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid vote payload' }, { status: 400 });
  }

  const { tmdbMovieId, liked } = parsed.data;

  await prisma.vote.upsert({
    where: {
      roomId_userId_tmdbMovieId: { roomId: room.id, userId: session.user.id, tmdbMovieId },
    },
    create: { roomId: room.id, userId: session.user.id, tmdbMovieId, liked },
    update: { liked },
  });

  if (liked) {
    await checkForMatch(room.id, tmdbMovieId);
  }

  return NextResponse.json({ ok: true });
}
