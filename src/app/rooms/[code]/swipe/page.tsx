import { notFound, redirect } from 'next/navigation';

import { SwipeStack } from '@/components/swipe/swipe-stack';
import { getRoomMovieDeck } from '@/lib/rooms/movies';
import { getRoomWithMembers, isRoomJoinable } from '@/lib/rooms/queries';
import { requireUser } from '@/lib/session';

export default async function SwipePage({ params }: PageProps<'/rooms/[code]/swipe'>) {
  const user = await requireUser();
  const { code } = await params;
  const normalizedCode = code.toUpperCase();

  const room = await getRoomWithMembers(normalizedCode);
  if (!room) notFound();

  const isMember = room.members.some((member) => member.userId === user.id);
  if (!isMember) {
    redirect(`/rooms/${normalizedCode}`);
  }
  if (!isRoomJoinable(room)) {
    redirect(`/rooms/${normalizedCode}`);
  }

  const movies = await getRoomMovieDeck({ genreFilter: room.genreFilter, region: room.region });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-4 py-8">
      <h1 className="mb-4 text-center text-lg font-semibold">{room.name}</h1>
      <SwipeStack movies={movies} />
    </div>
  );
}
