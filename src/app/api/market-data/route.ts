import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/market-data`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 