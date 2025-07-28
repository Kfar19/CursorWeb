const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/birdai.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  console.log('🗄️ Initializing Birdai Analytics Database...');

  // Create tables
  db.serialize(() => {
    // Market data table
    db.run(`
      CREATE TABLE IF NOT EXISTS market_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset TEXT NOT NULL,
        price REAL,
        market_cap REAL,
        volume_24h REAL,
        change_24h REAL,
        fundamental_score REAL,
        context TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sentiment data table
    db.run(`
      CREATE TABLE IF NOT EXISTS sentiment_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        asset TEXT,
        sentiment_score REAL,
        volume INTEGER,
        keywords TEXT,
        context TEXT,
        fundamental_context TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fundamental analysis table
    db.run(`
      CREATE TABLE IF NOT EXISTS fundamental_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        raw_value REAL,
        transformed_value REAL,
        context TEXT,
        insight TEXT,
        confidence_score REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insights table
    db.run(`
      CREATE TABLE IF NOT EXISTS insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        insight_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data_points TEXT,
        fundamental_context TEXT,
        actionable BOOLEAN DEFAULT 0,
        confidence_score REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Scraping logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS scraping_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        records_count INTEGER,
        error_message TEXT,
        duration_ms INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');
  });
}

// Helper functions for database operations
function insertMarketData(data) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO market_data (asset, price, market_cap, volume_24h, change_24h, fundamental_score, context)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      data.asset,
      data.price,
      data.market_cap,
      data.volume_24h,
      data.change_24h,
      data.fundamental_score,
      data.context
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    
    stmt.finalize();
  });
}

function insertSentimentData(data) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO sentiment_data (source, asset, sentiment_score, volume, keywords, context, fundamental_context)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      data.source,
      data.asset,
      data.sentiment_score,
      data.volume,
      JSON.stringify(data.keywords),
      data.context,
      data.fundamental_context
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    
    stmt.finalize();
  });
}

function insertInsight(data) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO insights (insight_type, title, description, data_points, fundamental_context, actionable, confidence_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      data.insight_type,
      data.title,
      data.description,
      JSON.stringify(data.data_points),
      data.fundamental_context,
      data.actionable ? 1 : 0,
      data.confidence_score
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    
    stmt.finalize();
  });
}

function getLatestInsights(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM insights 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getMarketDataHistory(asset, hours = 24) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM market_data 
      WHERE asset = ? AND timestamp >= datetime('now', '-${hours} hours')
      ORDER BY timestamp DESC
    `, [asset], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  insertMarketData,
  insertSentimentData,
  insertInsight,
  getLatestInsights,
  getMarketDataHistory
}; 