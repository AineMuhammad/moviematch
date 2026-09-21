import { JoinRoomForm } from '@/components/rooms/join-room-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/lib/session';

export default async function JoinRoomPage({ searchParams }: PageProps<'/rooms/join'>) {
  await requireUser();
  const { code } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-12 md:py-20 lg:py-28">
      <Card>
        <CardHeader>
          <CardTitle>Join a room</CardTitle>
          <CardDescription>Enter the code your host shared with you.</CardDescription>
        </CardHeader>
        <CardContent>
          <JoinRoomForm defaultCode={typeof code === 'string' ? code.toUpperCase() : undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
