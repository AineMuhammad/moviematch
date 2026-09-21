import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';

export function SiteHeader() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-base font-bold tracking-tight">
          🎬 MovieMatch
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
