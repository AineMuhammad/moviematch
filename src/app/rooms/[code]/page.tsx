import { notFound } from 'next/navigation';

import { CopyInviteButton } from '@/components/rooms/copy-invite-button';
import { RoomMemberList } from '@/components/rooms/room-member-list';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ensureRoomMembership, getRoomWithMembers, isRoomJoinable } from '@/lib/rooms/queries';
import { requireUser } from '@/lib/session';

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

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{room.name}</CardTitle>
            <CardDescription>
              Code <span className="font-mono font-semibold tracking-widest">{room.code}</span>
            </CardDescription>
          </div>
          <Badge variant={joinable ? 'default' : 'secondary'}>
            {joinable ? 'Open' : 'Expired'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {!joined ? (
            <p className="text-destructive text-sm">
              This room has expired, so you can&apos;t join it.
            </p>
          ) : null}

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              {room.members.length} {room.members.length === 1 ? 'member' : 'members'}
            </h3>
            <RoomMemberList room={room} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <CopyInviteButton code={room.code} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
