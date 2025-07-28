const { insertSentimentData } = require('../database/init');

// Main sentiment context analyzer
async function analyzeSentimentContext(sentimentData) {
  try {
    console.log('💭 Analyzing sentiment context...');
    
    const analysis = {
      retail_vs_institutional: analyzeRetailInstitutionalDivergence(sentimentData),
      news_impact: analyzeNewsImpact(sentimentData),
      social_momentum: analyzeSocialMomentum(sentimentData),
      market_psychology: analyzeMarketPsychology(sentimentData),
      timestamp: new Date().toISOString()
    };
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing sentiment context:', error);
    throw error;
  }
}

// Analyze retail vs institutional sentiment divergence
function analyzeRetailInstitutionalDivergence(data) {
  const retail = (data.reddit.sentiment_score + data.twitter.sentiment_score) / 2;
  const institutional = data.institutional.sentiment_score;
  const divergence = Math.abs(retail - institutional);
  
  let insight = '';
  let signal = 'neutral';
  let confidence = 0.5;
  
  if (divergence > 0.4) {
    if (retail > institutional) {
      insight = 'Retail sentiment extremely bullish while institutional flows steady - potential FOMO phase';
      signal = 'contrarian_bearish';
      confidence = 0.75;
    } else {
      insight = 'Institutional accumulation continues while retail sentiment moderate - accumulation phase';
      signal = 'contrarian_bullish';
      confidence = 0.8;
    }
  } else if (divergence > 0.2) {
    insight = 'Moderate divergence between retail and institutional sentiment - mixed signals';
    signal = 'mixed';
    confidence = 0.6;
  } else {
    insight = 'Retail and institutional sentiment aligned - consensus building';
    signal = 'consensus';
    confidence = 0.7;
  }
  
  return {
    retail_sentiment: retail,
    institutional_sentiment: institutional,
    divergence: divergence,
    signal: signal,
    insight: insight,
    confidence: confidence,
    actionable: true
  };
}

// Analyze news sentiment impact on fundamentals
function analyzeNewsImpact(data) {
  const newsSentiment = data.news.sentiment_score;
  const newsKeywords = data.news.keywords;
  
  let impact = 'neutral';
  let fundamentalContext = '';
  let confidence = 0.5;
  
  if (newsSentiment > 0.7) {
    impact = 'positive';
    fundamentalContext = 'Positive news sentiment supports institutional adoption narrative';
    confidence = 0.8;
  } else if (newsSentiment < 0.3) {
    impact = 'negative';
    fundamentalContext = 'Negative news sentiment may impact institutional confidence';
    confidence = 0.7;
  } else {
    impact = 'neutral';
    fundamentalContext = 'Neutral news sentiment - fundamentals remain stable';
    confidence = 0.6;
  }
  
  // Analyze keyword themes
  const themes = analyzeNewsThemes(newsKeywords);
  
  return {
    sentiment_score: newsSentiment,
    impact: impact,
    themes: themes,
    fundamental_context: fundamentalContext,
    confidence: confidence,
    actionable: true
  };
}

// Analyze social momentum and trends
function analyzeSocialMomentum(data) {
  const redditVolume = data.reddit.volume;
  const twitterVolume = data.twitter.volume;
  const totalVolume = redditVolume + twitterVolume;
  
  let momentum = 'stable';
  let insight = '';
  let confidence = 0.5;
  
  if (totalVolume > 20000) {
    momentum = 'high';
    insight = 'High social engagement indicates strong retail interest';
    confidence = 0.7;
  } else if (totalVolume > 10000) {
    momentum = 'moderate';
    insight = 'Moderate social engagement - steady retail participation';
    confidence = 0.6;
  } else {
    momentum = 'low';
    insight = 'Low social engagement - potential accumulation phase';
    confidence = 0.5;
  }
  
  // Analyze momentum direction
  const avgSentiment = (data.reddit.sentiment_score + data.twitter.sentiment_score) / 2;
  const momentumDirection = avgSentiment > 0.6 ? 'bullish' : avgSentiment < 0.4 ? 'bearish' : 'neutral';
  
  return {
    total_volume: totalVolume,
    momentum: momentum,
    direction: momentumDirection,
    insight: insight,
    confidence: confidence,
    actionable: true
  };
}

// Analyze market psychology patterns
function analyzeMarketPsychology(data) {
  const retailSentiment = (data.reddit.sentiment_score + data.twitter.sentiment_score) / 2;
  const institutionalSentiment = data.institutional.sentiment_score;
  
  let psychology = 'rational';
  let insight = '';
  let confidence = 0.5;
  
  // Fear and Greed analysis
  if (retailSentiment > 0.8 && institutionalSentiment < 0.5) {
    psychology = 'fomo';
    insight = 'Extreme retail optimism with institutional caution - potential FOMO phase';
    confidence = 0.8;
  } else if (retailSentiment < 0.3 && institutionalSentiment > 0.6) {
    psychology = 'fear';
    insight = 'Retail fear with institutional accumulation - contrarian opportunity';
    confidence = 0.75;
  } else if (retailSentiment > 0.7 && institutionalSentiment > 0.7) {
    psychology = 'euphoria';
    insight = 'Both retail and institutional sentiment bullish - momentum phase';
    confidence = 0.7;
  } else if (retailSentiment < 0.4 && institutionalSentiment < 0.4) {
    psychology = 'despair';
    insight = 'Both retail and institutional sentiment bearish - capitulation possible';
    confidence = 0.6;
  } else {
    psychology = 'rational';
    insight = 'Balanced sentiment - rational market conditions';
    confidence = 0.5;
  }
  
  return {
    psychology: psychology,
    retail_sentiment: retailSentiment,
    institutional_sentiment: institutionalSentiment,
    insight: insight,
    confidence: confidence,
    actionable: true
  };
}

// Analyze news themes and their fundamental impact
function analyzeNewsThemes(keywords) {
  const themes = {
    regulation: 0,
    adoption: 0,
    institutional: 0,
    technology: 0,
    market: 0
  };
  
  keywords.forEach(keyword => {
    const word = keyword.toLowerCase();
    
    if (word.includes('regulation') || word.includes('sec') || word.includes('compliance')) {
      themes.regulation++;
    }
    if (word.includes('adoption') || word.includes('enterprise') || word.includes('partnership')) {
      themes.adoption++;
    }
    if (word.includes('institutional') || word.includes('etf') || word.includes('fund')) {
      themes.institutional++;
    }
    if (word.includes('technology') || word.includes('upgrade') || word.includes('development')) {
      themes.technology++;
    }
    if (word.includes('market') || word.includes('price') || word.includes('trading')) {
      themes.market++;
    }
  });
  
  // Find dominant theme
  const dominantTheme = Object.entries(themes).reduce((a, b) => themes[a] > themes[b] ? a : b);
  
  return {
    themes,
    dominant: dominantTheme,
    fundamental_impact: getThemeImpact(dominantTheme)
  };
}

// Get fundamental impact of news themes
function getThemeImpact(theme) {
  const impacts = {
    regulation: 'Regulatory clarity supports institutional adoption',
    adoption: 'Enterprise adoption drives fundamental value',
    institutional: 'Institutional flows provide market stability',
    technology: 'Technical developments enhance utility',
    market: 'Market dynamics reflect current sentiment'
  };
  
  return impacts[theme] || 'Theme impact analysis not available';
}

// Generate sentiment-based trading signals
function generateSentimentSignals(sentimentData) {
  const signals = [];
  
  // Retail vs Institutional divergence signal
  const divergence = analyzeRetailInstitutionalDivergence(sentimentData);
  if (divergence.signal === 'contrarian_bullish') {
    signals.push({
      type: 'contrarian_bullish',
      strength: 'strong',
      description: 'Institutional accumulation while retail sentiment moderate',
      confidence: divergence.confidence
    });
  } else if (divergence.signal === 'contrarian_bearish') {
    signals.push({
      type: 'contrarian_bearish',
      strength: 'moderate',
      description: 'Retail FOMO while institutional flows steady',
      confidence: divergence.confidence
    });
  }
  
  // News sentiment signal
  const newsImpact = analyzeNewsImpact(sentimentData);
  if (newsImpact.impact === 'positive' && newsImpact.confidence > 0.7) {
    signals.push({
      type: 'news_bullish',
      strength: 'moderate',
      description: 'Positive news sentiment supports fundamentals',
      confidence: newsImpact.confidence
    });
  }
  
  return signals;
}

// Calculate sentiment confidence score
function calculateSentimentConfidence(sentimentData) {
  let confidence = 0.5; // Base confidence
  
  // Volume-based confidence
  const totalVolume = sentimentData.reddit.volume + sentimentData.twitter.volume;
  if (totalVolume > 15000) confidence += 0.2;
  
  // Sentiment consistency
  const sentimentDiff = Math.abs(sentimentData.reddit.sentiment_score - sentimentData.twitter.sentiment_score);
  if (sentimentDiff < 0.2) confidence += 0.1;
  
  // News sentiment strength
  if (Math.abs(sentimentData.news.sentiment_score - 0.5) > 0.3) confidence += 0.1;
  
  return Math.min(confidence, 0.95);
}

module.exports = {
  analyzeSentimentContext,
  analyzeRetailInstitutionalDivergence,
  analyzeNewsImpact,
  analyzeSocialMomentum,
  analyzeMarketPsychology,
  generateSentimentSignals,
  calculateSentimentConfidence
}; 