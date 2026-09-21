import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CopyInviteButton } from '@/components/rooms/copy-invite-button';
import { EndRoomButton } from '@/components/rooms/end-room-button';
import { LeaveRoomButton } from '@/components/rooms/leave-room-button';
import { RoomMemberList } from '@/components/rooms/room-member-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { ensureRoomMembership, getRoomWithMembers, isRoomJoinable } from '@/lib/rooms/queries';
import { requireUser } from '@/lib/session';

const OG_DESCRIPTION =
  'Swipe on movies together and get an instant match the moment everyone agrees.';

export async function generateMetadata({ params }: PageProps<'/rooms/[code]'>): Promise<Metadata> {
  const { code } = await params;
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    select: { name: true },
  });

  const title = room ? `Join "${room.name}" on MovieMatch` : 'MovieMatch room';

  return {
    title,
    description: OG_DESCRIPTION,
    openGraph: { title, description: OG_DESCRIPTION },
    twitter: { card: 'summary_large_image', title, description: OG_DESCRIPTION },
  };
}

export default async function RoomLobbyPage({ params }: PageProps<'/rooms/[code]'>) {
  const user = await requireUser();
  const { code } = await params;
  const normalizedCode = code.toUpperCase();

  let room = await getRoomWithMembers(normalizedCode);
  if (!room) notFound();

  const alreadyMember = room.members.some((member) => member.userId === user.id);
  if (!alreadyMember && isRoomJoinable(room)) {
    await ensureRoomMembership(room.id, user.id);
    room = await getRoomWithMembers(normalizedCode);
    if (!room) notFound();
  }

  const joined = room.members.some((member) => member.userId === user.id);
  const joinable = isRoomJoinable(room);
  const isHost = user.id === room.hostId;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{room.name}</h1>
              <p className="text-muted-foreground mt-1">
                Code <span className="font-mono font-semibold tracking-widest">{room.code}</span>
              </p>
            </div>
            <Badge variant={joinable ? 'default' : 'secondary'}>
              {joinable ? 'Open' : 'Expired'}
            </Badge>
          </div>

          {!joined ? (
            <p className="text-destructive text-sm">
              This room has expired, so you can&apos;t join it.
            </p>
          ) : null}

          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">
              {room.members.length} {room.members.length === 1 ? 'member' : 'members'}
            </h2>
            <RoomMemberList room={room} />
          </div>
        </div>

        <Card className="lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Room actions</CardTitle>
            <CardDescription>Invite more people, or jump into swiping.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <CopyInviteButton code={room.code} />
            {joined && joinable ? (
              <Button
                render={<Link href={`/rooms/${room.code}/swipe`} />}
                nativeButton={false}
                className="w-full"
              >
                Start swiping
              </Button>
            ) : null}

            {joined ? (
              <div className="border-border mt-2 flex flex-col gap-3 border-t pt-4">
                <LeaveRoomButton roomId={room.id} />
                {isHost && joinable ? <EndRoomButton roomId={room.id} /> : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
