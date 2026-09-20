import { CreateRoomForm } from '@/components/rooms/create-room-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/lib/session';
import { getMovieGenres } from '@/lib/tmdb/queries';

export default async function NewRoomPage() {
  await requireUser();

  const genres = await getMovieGenres().catch(() => ({ genres: [] }));

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create a room</CardTitle>
          <CardDescription>Set up a room and invite your group to swipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoomForm genres={genres.genres} />
        </CardContent>
      </Card>
    </div>
  );
}
