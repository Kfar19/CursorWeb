import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return mock sentiment data
    const mockData = {
      data: {
        overallSentiment: {
          bullish: 65,
          neutral: 25,
          bearish: 10
        },
        socialMentions: {
          twitter: 2847,
          reddit: 1243,
          news: 567
        },
        trendingTopics: [
          {
            topic: "AI Infrastructure",
            sentiment: "bullish",
            mentions: 1247,
            change: "+23%"
          },
          {
            topic: "DeFi Protocols",
            sentiment: "neutral",
            mentions: 892,
            change: "+5%"
          },
          {
            topic: "Web3 Gaming",
            sentiment: "bullish",
            mentions: 567,
            change: "+18%"
          }
        ],
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error generating sentiment data:', error);
    return NextResponse.json(
      { error: 'Failed to generate sentiment data' },
      { status: 500 }
    );
  }
} 