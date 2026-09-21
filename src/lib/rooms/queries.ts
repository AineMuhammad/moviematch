import { prisma } from '@/lib/prisma';

const memberSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const;

export function getRoomWithMembers(code: string) {
  return prisma.room.findUnique({
    where: { code },
    include: {
      host: { select: memberSelect },
      members: {
        include: { user: { select: memberSelect } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  });
}

export type RoomWithMembers = NonNullable<Awaited<ReturnType<typeof getRoomWithMembers>>>;

export function isRoomJoinable(room: Pick<RoomWithMembers, 'status' | 'expiresAt'>): boolean {
  return room.status === 'open' && room.expiresAt.getTime() > Date.now();
}

export async function ensureRoomMembership(roomId: string, userId: string) {
  await prisma.roomMember.upsert({
    where: { roomId_userId: { roomId, userId } },
    create: { roomId, userId },
    update: {},
  });
}

export function getRoomForApi(code: string) {
  return prisma.room.findUnique({
    where: { code },
    include: {
      members: { select: { userId: true } },
    },
  });
}

export type RoomForApi = NonNullable<Awaited<ReturnType<typeof getRoomForApi>>>;
