import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { RoomWithMembers } from '@/lib/rooms/queries';
import { initials } from '@/lib/utils';

export function RoomMemberList({ room }: { room: RoomWithMembers }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {room.members.map((member) => (
        <li
          key={member.id}
          className="border-border bg-card flex items-center gap-3 rounded-xl border p-3"
        >
          <Avatar>
            <AvatarImage src={member.user.image ?? undefined} alt="" />
            <AvatarFallback>{initials(member.user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{member.user.name ?? member.user.email}</p>
          </div>
          {member.user.id === room.hostId ? <Badge variant="secondary">Host</Badge> : null}
        </li>
      ))}
    </ul>
  );
}
