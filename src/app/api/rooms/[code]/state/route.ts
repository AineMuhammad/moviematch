import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getLatestMatch, getMatchDetails } from '@/lib/rooms/matches';
import { getRoomForApi } from '@/lib/rooms/queries';

export async function GET(_request: Request, { params }: RouteContext<'/api/rooms/[code]/state'>) {
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

  const [votedMemberIds, latestMatch] = await Promise.all([
    prisma.vote.findMany({
      where: { roomId: room.id },
      distinct: ['userId'],
      select: { userId: true },
    }),
    getLatestMatch(room.id),
  ]);

  const match = latestMatch ? await getMatchDetails(latestMatch) : null;

  return NextResponse.json({
    memberCount: room.members.length,
    votedMemberCount: votedMemberIds.length,
    status: room.status,
    match,
  });
}
