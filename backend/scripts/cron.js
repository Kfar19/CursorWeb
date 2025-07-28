const cron = require('node-cron');
const { getMarketData } = require('../scrapers/marketData');
const { getSentimentData } = require('../scrapers/sentimentData');
const { getInsights } = require('../analytics/insights');
const { insertMarketData, insertSentimentData } = require('../database/init');

console.log('⏰ Starting Birdai Analytics Cron Jobs...');

// Market data collection - every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('📊 Running market data collection...');
    const marketData = await getMarketData();
    
    // Store in database
    await insertMarketData({
      asset: 'global',
      price: null,
      market_cap: marketData.global.total_market_cap,
      volume_24h: marketData.global.total_volume,
      change_24h: marketData.global.market_cap_change_24h,
      fundamental_score: marketData.global.institutional_confidence,
      context: marketData.global.fundamental_context
    });
    
    console.log('✅ Market data collected and stored');
  } catch (error) {
    console.error('❌ Error in market data collection:', error);
  }
});

// Sentiment data collection - every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('💭 Running sentiment data collection...');
    const sentimentData = await getSentimentData();
    
    // Store in database
    for (const data of sentimentData) {
      await insertSentimentData(data);
    }
    
    console.log('✅ Sentiment data collected and stored');
  } catch (error) {
    console.error('❌ Error in sentiment data collection:', error);
  }
});

// Insights generation - every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('🧠 Running insights generation...');
    const insights = await getInsights();
    
    console.log(`✅ Generated ${insights.total_generated} insights`);
  } catch (error) {
    console.error('❌ Error in insights generation:', error);
  }
});

// Daily market analysis - every day at 9 AM UTC
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('📈 Running daily market analysis...');
    
    // Generate comprehensive daily report
    const dailyReport = await generateDailyReport();
    
    console.log('✅ Daily market analysis completed');
  } catch (error) {
    console.error('❌ Error in daily market analysis:', error);
  }
});

// Weekly fundamental analysis - every Sunday at 10 AM UTC
cron.schedule('0 10 * * 0', async () => {
  try {
    console.log('🏛️ Running weekly fundamental analysis...');
    
    // Generate weekly fundamental insights
    const weeklyInsights = await generateWeeklyFundamentals();
    
    console.log('✅ Weekly fundamental analysis completed');
  } catch (error) {
    console.error('❌ Error in weekly fundamental analysis:', error);
  }
});

// Health check - every minute
cron.schedule('* * * * *', () => {
  console.log('💚 Birdai Analytics Cron Jobs - Healthy');
});

// Helper functions
async function generateDailyReport() {
  // This would generate a comprehensive daily market report
  // with fundamental context and actionable insights
  return {
    date: new Date().toISOString(),
    summary: 'Daily market analysis with fundamental context',
    insights: []
  };
}

async function generateWeeklyFundamentals() {
  // This would analyze weekly fundamental trends
  // and generate long-term insights
  return {
    week: new Date().toISOString(),
    summary: 'Weekly fundamental analysis',
    trends: []
  };
}

console.log('🚀 Birdai Analytics Cron Jobs Started Successfully');
console.log('📊 Market data: Every 5 minutes');
console.log('💭 Sentiment data: Every 15 minutes');
console.log('🧠 Insights: Every hour');
console.log('📈 Daily analysis: 9 AM UTC daily');
console.log('🏛️ Weekly fundamentals: 10 AM UTC Sundays');

// Keep the process running
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Birdai Analytics Cron Jobs...');
  process.exit(0);
}); 