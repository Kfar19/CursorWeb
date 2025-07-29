import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Research Paper';
  const subtitle = searchParams.get('subtitle') || 'Birdai Research';
 
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f23',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <span style={{ fontSize: '32px', color: 'white', fontWeight: 'bold' }}>B</span>
          </div>
          <span style={{ fontSize: '32px', color: 'white', fontWeight: 'bold' }}>Birdai</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            maxWidth: '800px',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '600px',
            marginBottom: '40px',
          }}
        >
          {subtitle}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '18px',
            color: '#6b7280',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          See What Others Miss
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
} 