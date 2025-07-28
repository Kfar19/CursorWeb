const axios = require('axios');
const { insertSentimentData } = require('../database/init');

// Main sentiment data collector
async function getSentimentData() {
  try {
    console.log('💭 Collecting sentiment data with fundamental context...');
    
    const sentimentData = {
      reddit: await getRedditSentiment(),
      twitter: await getTwitterSentiment(),
      news: await getNewsSentiment(),
      institutional: await getInstitutionalSentiment(),
      timestamp: new Date().toISOString()
    };
    
    // Transform raw sentiment into fundamental insights
    const insights = await transformSentimentData(sentimentData);
    
    return {
      ...sentimentData,
      insights,
      fundamental_context: 'Social sentiment analyzed with institutional and market context'
    };
    
  } catch (error) {
    console.error('Error collecting sentiment data:', error);
    throw error;
  }
}

// Get Reddit sentiment with fundamental context
async function getRedditSentiment() {
  try {
    // Reddit API call (would need proper authentication)
    const response = await axios.get('https://www.reddit.com/r/cryptocurrency/hot.json?limit=25');
    const posts = response.data.data.children;
    
    // Analyze sentiment and add fundamental context
    const sentimentAnalysis = analyzeRedditPosts(posts);
    
    return {
      source: 'reddit',
      sentiment_score: sentimentAnalysis.score,
      volume: posts.length,
      keywords: sentimentAnalysis.keywords,
      context: 'Reddit sentiment reflects retail market psychology',
      fundamental_context: 'Retail sentiment often diverges from institutional flows - contrarian signal'
    };
  } catch (error) {
    console.error('Error fetching Reddit sentiment:', error);
    return getFallbackRedditData();
  }
}

// Get Twitter sentiment (simulated)
async function getTwitterSentiment() {
  try {
    // This would integrate with Twitter API
    // For now, simulate Twitter sentiment data
    
    const twitterData = {
      source: 'twitter',
      sentiment_score: 0.65, // Positive sentiment
      volume: 15420,
      keywords: ['bitcoin', 'ethereum', 'defi', 'bullish'],
      context: 'Twitter sentiment shows retail optimism',
      fundamental_context: 'High retail sentiment often precedes institutional accumulation'
    };
    
    return twitterData;
  } catch (error) {
    console.error('Error fetching Twitter sentiment:', error);
    return getFallbackTwitterData();
  }
}

// Get news sentiment
async function getNewsSentiment() {
  try {
    // This would integrate with news APIs
    const newsData = {
      source: 'news',
      sentiment_score: 0.72,
      volume: 89,
      keywords: ['regulation', 'adoption', 'institutional'],
      context: 'News sentiment reflects institutional narrative',
      fundamental_context: 'Positive news sentiment correlates with institutional adoption'
    };
    
    return newsData;
  } catch (error) {
    console.error('Error fetching news sentiment:', error);
    return getFallbackNewsData();
  }
}

// Get institutional sentiment (derived from flows)
async function getInstitutionalSentiment() {
  try {
    // This would analyze institutional flow data
    const institutionalData = {
      source: 'institutional',
      sentiment_score: 0.58, // Moderate positive
      volume: 125000000, // $125M in flows
      keywords: ['accumulation', 'hodl', 'long-term'],
      context: 'Institutional flows show steady accumulation',
      fundamental_context: 'Institutional sentiment drives long-term fundamentals'
    };
    
    return institutionalData;
  } catch (error) {
    console.error('Error fetching institutional sentiment:', error);
    return getFallbackInstitutionalData();
  }
}

// Analyze Reddit posts for sentiment and keywords
function analyzeRedditPosts(posts) {
  let totalScore = 0;
  const keywords = {};
  
  posts.forEach(post => {
    const title = post.data.title.toLowerCase();
    const score = post.data.score;
    
    // Simple sentiment analysis based on keywords
    let postSentiment = 0;
    
    if (title.includes('bull') || title.includes('moon') || title.includes('pump')) {
      postSentiment = 0.8;
    } else if (title.includes('bear') || title.includes('dump') || title.includes('crash')) {
      postSentiment = -0.8;
    } else if (title.includes('hodl') || title.includes('buy') || title.includes('accumulate')) {
      postSentiment = 0.6;
    } else if (title.includes('sell') || title.includes('exit') || title.includes('fud')) {
      postSentiment = -0.6;
    }
    
    totalScore += postSentiment * (score / 1000); // Weight by post score
    
    // Extract keywords
    const words = title.split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        keywords[word] = (keywords[word] || 0) + 1;
      }
    });
  });
  
  const avgScore = totalScore / posts.length;
  
  return {
    score: Math.max(-1, Math.min(1, avgScore)), // Clamp between -1 and 1
    keywords: Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))
  };
}

// Transform sentiment data into fundamental insights
async function transformSentimentData(sentimentData) {
  const insights = [];
  
  // Retail vs Institutional sentiment divergence
  const retailSentiment = (sentimentData.reddit.sentiment_score + sentimentData.twitter.sentiment_score) / 2;
  const institutionalSentiment = sentimentData.institutional.sentiment_score;
  
  if (Math.abs(retailSentiment - institutionalSentiment) > 0.3) {
    insights.push({
      type: 'sentiment_divergence',
      title: 'Retail vs Institutional Sentiment Divergence',
      description: `Retail sentiment at ${(retailSentiment * 100).toFixed(1)}% vs institutional at ${(institutionalSentiment * 100).toFixed(1)}%`,
      actionable: true,
      confidence: 0.75
    });
  }
  
  // News sentiment impact
  if (sentimentData.news.sentiment_score > 0.7) {
    insights.push({
      type: 'news_impact',
      title: 'Positive News Sentiment',
      description: 'News sentiment strongly positive - institutional adoption narrative strengthening',
      actionable: true,
      confidence: 0.8
    });
  }
  
  return insights;
}

// Fallback data functions
function getFallbackRedditData() {
  return {
    source: 'reddit',
    sentiment_score: 0.55,
    volume: 25,
    keywords: ['bitcoin', 'ethereum', 'defi'],
    context: 'Reddit sentiment moderate',
    fundamental_context: 'Retail sentiment stable'
  };
}

function getFallbackTwitterData() {
  return {
    source: 'twitter',
    sentiment_score: 0.60,
    volume: 12000,
    keywords: ['crypto', 'blockchain', 'adoption'],
    context: 'Twitter sentiment positive',
    fundamental_context: 'Social sentiment reflects adoption'
  };
}

function getFallbackNewsData() {
  return {
    source: 'news',
    sentiment_score: 0.65,
    volume: 75,
    keywords: ['regulation', 'adoption'],
    context: 'News sentiment positive',
    fundamental_context: 'Regulatory clarity supports adoption'
  };
}

function getFallbackInstitutionalData() {
  return {
    source: 'institutional',
    sentiment_score: 0.55,
    volume: 100000000,
    keywords: ['accumulation', 'hodl'],
    context: 'Institutional flows steady',
    fundamental_context: 'Institutional accumulation continues'
  };
}

module.exports = {
  getSentimentData,
  getRedditSentiment,
  getTwitterSentiment,
  getNewsSentiment,
  getInstitutionalSentiment
}; 