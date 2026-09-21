import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RoomWithMembers } from '@/lib/rooms/queries';
import { initials } from '@/lib/utils';

export function SwipeSidePanel({ room }: { room: RoomWithMembers }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
      <div>
        <h1 className="text-xl font-semibold">{room.name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Code <span className="font-mono tracking-widest">{room.code}</span>
        </p>
      </div>

      <div>
        <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          Members
        </h2>
        <ul className="flex flex-col gap-3">
          {room.members.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <Avatar className="size-7">
                <AvatarImage src={member.user.image ?? undefined} alt="" />
                <AvatarFallback className="text-xs">{initials(member.user.name)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">{member.user.name ?? member.user.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
