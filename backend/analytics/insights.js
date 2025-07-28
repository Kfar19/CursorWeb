const { getLatestInsights, insertInsight } = require('../database/init');
const { analyzeMarketFundamentals } = require('./fundamentals');
const { analyzeSentimentContext } = require('./sentiment');
const moment = require('moment');

// Main insights generator
async function getInsights() {
  try {
    console.log('🧠 Generating fundamental insights...');
    
    const insights = [];
    
    // Market fundamental insights
    const marketInsights = await generateMarketInsights();
    insights.push(...marketInsights);
    
    // Sentiment context insights
    const sentimentInsights = await generateSentimentInsights();
    insights.push(...sentimentInsights);
    
    // Cross-asset correlation insights
    const correlationInsights = await generateCorrelationInsights();
    insights.push(...correlationInsights);
    
    // Store insights in database
    for (const insight of insights) {
      await insertInsight(insight);
    }
    
    return {
      insights: insights.slice(0, 10), // Return latest 10
      total_generated: insights.length,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

// Generate market-based fundamental insights
async function generateMarketInsights() {
  const insights = [];
  
  // Example: Bitcoin dominance analysis
  const btcInsight = {
    insight_type: 'market_fundamental',
    title: 'Bitcoin Dominance vs. Institutional Adoption',
    description: 'BTC dominance declining while institutional holdings increase - suggests rotation into altcoins but with institutional backing',
    data_points: {
      btc_dominance: 48.2,
      institutional_holdings: 1250000,
      altcoin_market_cap: 850000000000
    },
    fundamental_context: 'Institutional adoption creates floor, retail rotation creates opportunity',
    actionable: true,
    confidence_score: 0.85
  };
  
  insights.push(btcInsight);
  
  // Example: DeFi TVL vs. Traditional Finance
  const defiInsight = {
    insight_type: 'market_fundamental',
    title: 'DeFi TVL vs. Traditional Banking Efficiency',
    description: 'DeFi protocols processing $2B daily with 0.1% fees vs traditional banking 2-3% fees',
    data_points: {
      defi_tvl: 45000000000,
      daily_volume: 2000000000,
      avg_fee_percentage: 0.1,
      traditional_banking_fees: 2.5
    },
    fundamental_context: 'Efficiency gains create sustainable competitive advantage',
    actionable: true,
    confidence_score: 0.92
  };
  
  insights.push(defiInsight);
  
  return insights;
}

// Generate sentiment-based context insights
async function generateSentimentInsights() {
  const insights = [];
  
  // Example: Social sentiment vs. institutional flows
  const sentimentInsight = {
    insight_type: 'sentiment_context',
    title: 'Retail FOMO vs. Institutional Accumulation',
    description: 'Social sentiment extremely bullish while institutional flows show steady accumulation - divergence suggests retail late to the party',
    data_points: {
      social_sentiment_score: 0.85,
      institutional_flow_24h: 125000000,
      retail_flow_24h: -45000000
    },
    fundamental_context: 'Institutional flows precede retail sentiment - accumulation phase continues',
    actionable: true,
    confidence_score: 0.78
  };
  
  insights.push(sentimentInsight);
  
  return insights;
}

// Generate correlation-based insights
async function generateCorrelationInsights() {
  const insights = [];
  
  // Example: Crypto vs. Traditional markets correlation
  const correlationInsight = {
    insight_type: 'correlation_analysis',
    title: 'Crypto Decoupling from Traditional Markets',
    description: 'Bitcoin correlation with S&P 500 dropped from 0.8 to 0.3 - crypto becoming independent asset class',
    data_points: {
      btc_sp500_correlation: 0.3,
      previous_correlation: 0.8,
      independence_score: 0.7
    },
    fundamental_context: 'Decoupling validates crypto as separate asset class, reduces systemic risk',
    actionable: true,
    confidence_score: 0.88
  };
  
  insights.push(correlationInsight);
  
  return insights;
}

// Get specific asset insights
async function getAssetInsights(asset) {
  try {
    const insights = await getLatestInsights(50);
    
    // Filter insights relevant to the asset
    const assetInsights = insights.filter(insight => {
      const dataPoints = JSON.parse(insight.data_points || '{}');
      return dataPoints[asset] || insight.description.toLowerCase().includes(asset.toLowerCase());
    });
    
    return {
      asset,
      insights: assetInsights.slice(0, 5),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error getting insights for ${asset}:`, error);
    throw error;
  }
}

// Generate real-time insight based on current data
async function generateRealTimeInsight(data) {
  try {
    const insight = {
      insight_type: 'real_time',
      title: 'Real-time Market Context',
      description: analyzeRealTimeData(data),
      data_points: data,
      fundamental_context: 'Live data transformed into actionable context',
      actionable: true,
      confidence_score: calculateConfidence(data)
    };
    
    await insertInsight(insight);
    return insight;
    
  } catch (error) {
    console.error('Error generating real-time insight:', error);
    throw error;
  }
}

// Helper function to analyze real-time data
function analyzeRealTimeData(data) {
  // Transform raw data into meaningful context
  if (data.price_change > 5) {
    return `Sharp ${data.price_change}% move - check for news catalysts or whale movements`;
  } else if (data.volume_spike > 200) {
    return `Volume spike ${data.volume_spike}% above average - institutional activity likely`;
  } else {
    return 'Normal trading activity - no significant signals detected';
  }
}

// Calculate confidence score based on data quality
function calculateConfidence(data) {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence based on data quality indicators
  if (data.volume > 1000000) confidence += 0.2;
  if (data.market_cap > 1000000000) confidence += 0.1;
  if (data.sentiment_score && Math.abs(data.sentiment_score) > 0.7) confidence += 0.1;
  
  return Math.min(confidence, 0.95); // Cap at 95%
}

module.exports = {
  getInsights,
  getAssetInsights,
  generateRealTimeInsight,
  generateMarketInsights,
  generateSentimentInsights,
  generateCorrelationInsights
}; 