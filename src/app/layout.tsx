import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { SiteHeader } from '@/components/layout/site-header';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const DESCRIPTION = 'Swipe on movies with friends until everyone agrees on one.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: {
    default: 'MovieMatch',
    template: '%s · MovieMatch',
  },
  description: DESCRIPTION,
  openGraph: {
    title: 'MovieMatch',
    description: DESCRIPTION,
    siteName: 'MovieMatch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieMatch',
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
