import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { RoomWithMembers } from '@/lib/rooms/queries';

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function RoomMemberList({ room }: { room: RoomWithMembers }) {
  return (
    <ul className="divide-border divide-y">
      {room.members.map((member) => (
        <li key={member.id} className="flex items-center gap-3 py-3">
          <Avatar>
            <AvatarImage src={member.user.image ?? undefined} alt="" />
            <AvatarFallback>{initials(member.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{member.user.name ?? member.user.email}</p>
          </div>
          {member.user.id === room.hostId ? <Badge variant="secondary">Host</Badge> : null}
        </li>
      ))}
    </ul>
  );
}
