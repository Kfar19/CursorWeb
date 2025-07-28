const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

// Import our modules
const { initializeDatabase } = require('./database/init');
const { getInsights } = require('./analytics/insights');
const { getMarketData } = require('./scrapers/marketData');
const { getSentimentData } = require('./scrapers/sentimentData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Birdai Analytics API' });
});

// Get fundamental insights (transformed data)
app.get('/api/insights', async (req, res) => {
  try {
    const insights = await getInsights();
    res.json({
      success: true,
      data: insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch insights'
    });
  }
});

// Get market data with fundamental context
app.get('/api/market-data', async (req, res) => {
  try {
    const marketData = await getMarketData();
    res.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data'
    });
  }
});

// Get sentiment analysis with context
app.get('/api/sentiment', async (req, res) => {
  try {
    const sentimentData = await getSentimentData();
    res.json({
      success: true,
      data: sentimentData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment data'
    });
  }
});

// Get specific fundamental analysis
app.get('/api/fundamentals/:asset', async (req, res) => {
  try {
    const { asset } = req.params;
    const fundamentals = await getFundamentals(asset);
    res.json({
      success: true,
      data: fundamentals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching fundamentals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fundamentals'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Birdai Analytics API running on port ${PORT}`);
  console.log(`📊 Transform raw data into fundamental insights`);
});

module.exports = app; 