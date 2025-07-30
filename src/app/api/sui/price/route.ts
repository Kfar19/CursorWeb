import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch Sui price data from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }

    const data = await response.json();
    
    const priceData = {
      price: data.sui?.usd || 0,
      change24h: data.sui?.usd_24h_change || 0,
      marketCap: data.sui?.usd_market_cap || 0,
      volume24h: data.sui?.usd_24h_vol || 0,
      timestamp: Date.now()
    };

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Error fetching Sui price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 