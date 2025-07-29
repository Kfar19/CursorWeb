import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return mock insights data
    const mockData = {
      data: {
        insights: [
          {
            id: 1,
            title: "AI Infrastructure Demand Surge",
            description: "Increased institutional adoption of AI-native protocols",
            sentiment: "bullish",
            confidence: 0.85,
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            title: "DeFi Liquidity Migration",
            description: "Significant capital flows to emerging DeFi protocols",
            sentiment: "neutral",
            confidence: 0.72,
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            title: "Layer 2 Scaling Solutions",
            description: "Growing adoption of L2 solutions for improved throughput",
            sentiment: "bullish",
            confidence: 0.91,
            timestamp: new Date().toISOString()
          }
        ]
      }
    };
    
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 