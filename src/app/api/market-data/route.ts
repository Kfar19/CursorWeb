import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return mock market data
    const mockData = {
      data: {
        totalMarketCap: 3250000000000,
        bitcoinPrice: 42000,
        ethereumPrice: 2800,
        volume24h: 85000000000,
        dominance: {
          bitcoin: 52.3,
          ethereum: 18.7,
          others: 29.0
        },
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error generating market data:', error);
    return NextResponse.json(
      { error: 'Failed to generate market data' },
      { status: 500 }
    );
  }
} 