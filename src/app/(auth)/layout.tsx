import { PartyPopper, Sparkles, Users } from 'lucide-react';
import type { ReactNode } from 'react';

const VALUE_PROPS = [
  { icon: Users, text: 'Create a room and invite your group in seconds' },
  { icon: Sparkles, text: 'Everyone swipes through the same movies, live' },
  { icon: PartyPopper, text: 'Get an instant match the moment everyone agrees' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <div className="border-border bg-muted/30 relative hidden flex-1 flex-col justify-center gap-10 overflow-hidden border-r p-12 lg:flex xl:p-16">
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
        <p className="relative text-2xl font-bold tracking-tight">🎬 MovieMatch</p>
        <div className="relative flex flex-col gap-6">
          <h2 className="max-w-sm text-3xl font-bold tracking-tight xl:text-4xl">
            Stop scrolling. Start matching.
          </h2>
          <ul className="flex flex-col gap-4">
            {VALUE_PROPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4" />
                </span>
                <span className="text-muted-foreground text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
