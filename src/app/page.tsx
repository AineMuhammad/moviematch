import { PartyPopper, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { PosterFan } from '@/components/home/poster-fan';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { getPopularMovies } from '@/lib/tmdb/queries';

const STEPS = [
  {
    icon: Users,
    title: 'Create a room',
    description: 'Set up a room, optionally filter by genre or region, and share the code.',
  },
  {
    icon: Sparkles,
    title: 'Swipe together',
    description: 'Everyone swipes through the same stack of movies, live.',
  },
  {
    icon: PartyPopper,
    title: 'Get matched',
    description: "The instant everyone likes the same movie, it's a match — trailer included.",
  },
];

export default async function Home() {
  const session = await auth();
  const posters = await getPopularMovies()
    .then((res) => res.results.slice(0, 5))
    .catch(() => []);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              🎬 MovieMatch
            </h1>
            <p className="text-muted-foreground max-w-md text-lg">
              Create a room, swipe on movies with your group, and get an instant match the moment
              everyone agrees.
            </p>

            {session?.user ? (
              <div className="flex flex-col items-center gap-4 lg:items-start">
                <p className="text-sm">
                  Signed in as <span className="font-medium">{session.user.email}</span>
                </p>
                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Button render={<Link href="/rooms/new" />} nativeButton={false} size="lg">
                    Create a room
                  </Button>
                  <Button
                    render={<Link href="/rooms/join" />}
                    nativeButton={false}
                    variant="outline"
                    size="lg"
                  >
                    Join a room
                  </Button>
                </div>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button render={<Link href="/sign-up" />} nativeButton={false} size="lg">
                  Get started
                </Button>
                <Button
                  render={<Link href="/sign-in" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>

          {posters.length > 0 ? <PosterFan posters={posters} /> : null}
        </div>
      </section>

      <section className="border-border border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 md:gap-8 lg:px-8 lg:py-24">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 text-center md:items-start md:text-left"
            >
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                <step.icon className="size-5" />
              </div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
