import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'IKEA Clone App';
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#0058a3',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>IKEA AR</div>
        <div style={{ fontSize: 48, marginTop: 20 }}>Experience furniture in your space</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
