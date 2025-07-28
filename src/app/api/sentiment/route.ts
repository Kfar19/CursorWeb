import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/sentiment`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentiment data' },
      { status: 500 }
    );
  }
} 