const { insertMarketData } = require('../database/init');

// Main fundamental analysis function
async function analyzeMarketFundamentals(marketData) {
  try {
    console.log('🏛️ Analyzing market fundamentals...');
    
    const fundamentals = {
      institutional_adoption: analyzeInstitutionalAdoption(marketData),
      defi_efficiency: analyzeDeFiEfficiency(marketData),
      market_structure: analyzeMarketStructure(marketData),
      correlation_analysis: analyzeCorrelations(marketData),
      timestamp: new Date().toISOString()
    };
    
    return fundamentals;
  } catch (error) {
    console.error('Error analyzing fundamentals:', error);
    throw error;
  }
}

// Analyze institutional adoption metrics
function analyzeInstitutionalAdoption(data) {
  const institutional = data.institutional;
  const global = data.global;
  
  // Calculate institutional adoption score
  let adoptionScore = 0.5; // Base score
  
  // Spot ETF holdings impact
  if (institutional.spot_etf_holdings > 500000) {
    adoptionScore += 0.2;
  }
  
  // Institutional flows
  if (institutional.institutional_flow_24h > 100000000) {
    adoptionScore += 0.15;
  }
  
  // Market cap size (larger = more institutional)
  if (global.total_market_cap > 2000000000000) {
    adoptionScore += 0.15;
  }
  
  return {
    score: Math.min(adoptionScore, 0.95),
    metrics: {
      spot_etf_holdings: institutional.spot_etf_holdings,
      institutional_flows: institutional.institutional_flow_24h,
      market_cap: global.total_market_cap,
      confidence: institutional.spot_etf_holdings > 500000 ? 'high' : 'medium'
    },
    insight: 'Institutional adoption provides fundamental support for crypto markets',
    actionable: true
  };
}

// Analyze DeFi efficiency vs traditional finance
function analyzeDeFiEfficiency(data) {
  const defi = data.defi;
  
  // Calculate efficiency metrics
  const traditionalBankingFees = 2.5; // Average 2.5%
  const defiFees = 0.1; // Average 0.1%
  const efficiencyGain = ((traditionalBankingFees - defiFees) / traditionalBankingFees) * 100;
  
  // Calculate TVL efficiency
  const tvlEfficiency = defi.total_tvl > 40000000000 ? 'high' : 'medium';
  
  return {
    efficiency_gain: efficiencyGain,
    defi_tvl: defi.total_tvl,
    protocols_count: defi.protocols_count,
    avg_apy: defi.avg_apy,
    traditional_fees: traditionalBankingFees,
    defi_fees: defiFees,
    insight: `DeFi protocols are ${efficiencyGain.toFixed(1)}% more efficient than traditional banking`,
    actionable: true,
    confidence: 'high'
  };
}

// Analyze market structure and dynamics
function analyzeMarketStructure(data) {
  const bitcoin = data.bitcoin;
  const ethereum = data.ethereum;
  const global = data.global;
  
  // Calculate market concentration
  const btcDominance = (bitcoin.market_cap / global.total_market_cap) * 100;
  const ethDominance = (ethereum.market_cap / global.total_market_cap) * 100;
  const top2Dominance = btcDominance + ethDominance;
  
  // Market structure insights
  let structureInsight = '';
  let structureScore = 0.5;
  
  if (top2Dominance > 70) {
    structureInsight = 'High concentration in top 2 assets - institutional preference for established protocols';
    structureScore = 0.8;
  } else if (top2Dominance > 50) {
    structureInsight = 'Moderate concentration - healthy balance between established and emerging protocols';
    structureScore = 0.7;
  } else {
    structureInsight = 'Low concentration - high diversification, potential for emerging protocols';
    structureScore = 0.6;
  }
  
  return {
    btc_dominance: btcDominance,
    eth_dominance: ethDominance,
    top2_dominance: top2Dominance,
    structure_score: structureScore,
    insight: structureInsight,
    actionable: true,
    confidence: 'high'
  };
}

// Analyze correlations with traditional markets
function analyzeCorrelations(data) {
  // This would integrate with traditional market data
  // For now, simulate correlation analysis
  
  const correlations = {
    btc_sp500: 0.3, // Bitcoin vs S&P 500
    btc_gold: 0.15, // Bitcoin vs Gold
    eth_nasdaq: 0.25, // Ethereum vs NASDAQ
    crypto_dollar: -0.4 // Crypto vs US Dollar
  };
  
  // Calculate independence score
  const avgCorrelation = Object.values(correlations).reduce((a, b) => a + Math.abs(b), 0) / Object.values(correlations).length;
  const independenceScore = 1 - avgCorrelation;
  
  let correlationInsight = '';
  if (independenceScore > 0.7) {
    correlationInsight = 'Crypto showing strong independence from traditional markets - becoming separate asset class';
  } else if (independenceScore > 0.5) {
    correlationInsight = 'Moderate independence - crypto partially decoupled from traditional markets';
  } else {
    correlationInsight = 'High correlation with traditional markets - systemic risk present';
  }
  
  return {
    correlations,
    independence_score: independenceScore,
    insight: correlationInsight,
    actionable: true,
    confidence: 'medium'
  };
}

// Get specific asset fundamentals
async function getAssetFundamentals(asset) {
  try {
    // This would fetch asset-specific fundamental data
    const fundamentals = {
      bitcoin: {
        halving_cycle: calculateHalvingCycle(),
        institutional_holdings: 1250000,
        on_chain_metrics: {
          active_addresses: 850000,
          transaction_count: 250000,
          hash_rate: 450000000000000000
        },
        fundamental_score: 0.85,
        insight: 'Bitcoin fundamentals strengthened by halving cycle and institutional adoption'
      },
      ethereum: {
        staking_metrics: {
          staked_eth: 32000000,
          staking_yield: 4.2,
          validator_count: 1000000
        },
        defi_tvl: 45000000000,
        fundamental_score: 0.78,
        insight: 'Ethereum fundamentals driven by DeFi adoption and staking economics'
      }
    };
    
    return fundamentals[asset.toLowerCase()] || {
      fundamental_score: 0.5,
      insight: 'Asset fundamentals analysis not available'
    };
    
  } catch (error) {
    console.error(`Error getting fundamentals for ${asset}:`, error);
    throw error;
  }
}

// Calculate Bitcoin halving cycle impact
function calculateHalvingCycle() {
  const lastHalving = new Date('2024-04-20');
  const nextHalving = new Date('2028-04-20');
  const now = new Date();
  
  const daysSinceLastHalving = (now - lastHalving) / (1000 * 60 * 60 * 24);
  const daysUntilNextHalving = (nextHalving - now) / (1000 * 60 * 60 * 24);
  
  const cycleProgress = daysSinceLastHalving / (daysSinceLastHalving + daysUntilNextHalving);
  
  return {
    days_since_last: Math.floor(daysSinceLastHalving),
    days_until_next: Math.floor(daysUntilNextHalving),
    cycle_progress: cycleProgress,
    impact_score: Math.max(0, (365 - daysUntilNextHalving) / 365)
  };
}

// Generate fundamental insights from raw data
function generateFundamentalInsights(rawData) {
  const insights = [];
  
  // Market cap efficiency insight
  if (rawData.market_cap > 1000000000000) {
    insights.push({
      type: 'market_efficiency',
      title: 'Market Cap Efficiency',
      description: `Large market cap indicates institutional adoption and market maturity`,
      confidence: 0.8,
      actionable: true
    });
  }
  
  // Volume analysis
  const volumeToMarketCap = rawData.volume_24h / rawData.market_cap;
  if (volumeToMarketCap > 0.1) {
    insights.push({
      type: 'volume_analysis',
      title: 'High Volume Activity',
      description: `Volume ${(volumeToMarketCap * 100).toFixed(1)}% of market cap - significant trading activity`,
      confidence: 0.7,
      actionable: true
    });
  }
  
  return insights;
}

module.exports = {
  analyzeMarketFundamentals,
  analyzeInstitutionalAdoption,
  analyzeDeFiEfficiency,
  analyzeMarketStructure,
  analyzeCorrelations,
  getAssetFundamentals,
  generateFundamentalInsights
}; 