import { ImageResponse } from 'next/og';

export const alt = 'MovieMatch';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
      <div style={{ fontSize: 72 }}>🎬</div>
      <div style={{ fontSize: 64, fontWeight: 700 }}>MovieMatch</div>
      <div style={{ fontSize: 32, color: '#a1a1aa' }}>
        Swipe on movies together. Get an instant match.
      </div>
    </div>,
    { ...size },
  );
}
