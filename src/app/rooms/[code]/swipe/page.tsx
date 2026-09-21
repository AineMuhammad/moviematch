import { notFound, redirect } from 'next/navigation';

import { SwipeScreen } from '@/components/swipe/swipe-screen';
import { SwipeSidePanel } from '@/components/swipe/swipe-side-panel';
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
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
        <SwipeSidePanel room={room} />

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col lg:mx-0 lg:max-w-md">
          <h1 className="mb-4 text-center text-lg font-semibold lg:hidden">{room.name}</h1>
          <SwipeScreen code={room.code} movies={movies} />
        </div>
      </div>
    </div>
  );
}
