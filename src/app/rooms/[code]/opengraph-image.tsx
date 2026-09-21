import { ImageResponse } from 'next/og';

import { prisma } from '@/lib/prisma';

export const alt = 'MovieMatch room invite';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    select: { name: true },
  });

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        backgroundColor: '#0a0a0a',
        color: '#fafafa',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 64 }}>🎬</div>
      <div style={{ fontSize: 56, fontWeight: 700, textAlign: 'center', padding: '0 60px' }}>
        {room ? room.name : 'MovieMatch'}
      </div>
      <div style={{ fontSize: 32, color: '#a1a1aa' }}>
        Join on MovieMatch · Code {code.toUpperCase()}
      </div>
    </div>,
    { ...size },
  );
}
