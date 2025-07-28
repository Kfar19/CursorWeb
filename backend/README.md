# Birdai Analytics Backend

**Transform raw data into fundamental insights with context**

## 🎯 Vision

Birdai is a **data analytics platform** that scrapes raw data from various sources, transforms it with relevant fundamental variables, and presents actionable insights with context. Users come to Birdai for **context and insights**, not raw data.

## 🏗️ Architecture

```
Raw Data Sources → Scrapers → Database → Analytics Engine → Insights API → Frontend
```

### Core Components:

- **📊 Data Scrapers**: Collect raw market, sentiment, and fundamental data
- **🗄️ Database**: Store historical data and insights
- **🧠 Analytics Engine**: Transform raw data into fundamental insights
- **⏰ Cron Jobs**: Automated data collection and analysis
- **🚀 API Server**: Serve insights to frontend

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Data Directory
```bash
mkdir data
```

### 3. Start the API Server
```bash
npm run dev
```

### 4. Start Cron Jobs (Optional)
```bash
npm run cron
```

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Get Fundamental Insights
```
GET /api/insights
```
Returns transformed data with fundamental context and actionable insights.

### Get Market Data with Context
```
GET /api/market-data
```
Returns market data enriched with institutional and fundamental analysis.

### Get Sentiment Analysis
```
GET /api/sentiment
```
Returns sentiment data with fundamental context and market implications.

### Get Asset-Specific Fundamentals
```
GET /api/fundamentals/:asset
```
Returns fundamental analysis for a specific asset (e.g., `/api/fundamentals/bitcoin`).

## 🧠 Analytics Engine

### Insight Types:

1. **Market Fundamentals**
   - Institutional adoption vs. retail sentiment
   - Market cap efficiency analysis
   - DeFi vs. traditional finance comparisons

2. **Sentiment Context**
   - Social sentiment vs. institutional flows
   - News impact on fundamental metrics
   - Market psychology analysis

3. **Correlation Analysis**
   - Crypto vs. traditional market correlations
   - Cross-asset fundamental relationships
   - Systemic risk assessment

### Example Insights:

```json
{
  "insight_type": "market_fundamental",
  "title": "Bitcoin Dominance vs. Institutional Adoption",
  "description": "BTC dominance declining while institutional holdings increase - suggests rotation into altcoins but with institutional backing",
  "fundamental_context": "Institutional adoption creates floor, retail rotation creates opportunity",
  "actionable": true,
  "confidence_score": 0.85
}
```

## ⏰ Automated Tasks

### Data Collection Schedule:
- **Market Data**: Every 5 minutes
- **Sentiment Data**: Every 15 minutes
- **Insights Generation**: Every hour
- **Daily Analysis**: 9 AM UTC daily
- **Weekly Fundamentals**: 10 AM UTC Sundays

## 🗄️ Database Schema

### Tables:
- `market_data`: Price, volume, market cap with fundamental scores
- `sentiment_data`: Social sentiment with fundamental context
- `fundamental_analysis`: Raw vs. transformed data with insights
- `insights`: Generated insights with confidence scores
- `scraping_logs`: Data collection monitoring

## 🔧 Configuration

Create a `.env` file:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=./data/birdai.db
```

## 🚀 Deployment

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```

### Cron Jobs:
```bash
npm run cron
```

## 📈 Data Sources

### Market Data:
- CoinGecko API
- DeFi Pulse (scraped)
- Institutional data providers

### Sentiment Data:
- Reddit r/cryptocurrency
- Twitter sentiment
- News sentiment analysis

### Fundamental Data:
- On-chain metrics
- Institutional holdings
- DeFi protocol data

## 🎯 Key Features

### 1. **Context Over Raw Data**
- Transform price movements into fundamental insights
- Add institutional context to market data
- Provide actionable interpretations

### 2. **Fundamental Analysis**
- Institutional adoption metrics
- DeFi efficiency comparisons
- Cross-asset correlation analysis

### 3. **Real-time Insights**
- Live data transformation
- Automated insight generation
- Confidence scoring

### 4. **Historical Context**
- Trend analysis over time
- Fundamental pattern recognition
- Predictive insights

## 🔮 Future Enhancements

- **Machine Learning**: Predictive analytics
- **Real-time Alerts**: Fundamental signal notifications
- **Portfolio Integration**: Personal investment tracking
- **Advanced Analytics**: Multi-timeframe analysis
- **API Rate Limiting**: Production-ready scaling

## 📝 License

MIT License - see LICENSE file for details

---

**Birdai Analytics**: Where raw data becomes fundamental insights. 🚀 