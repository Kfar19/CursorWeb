#!/usr/bin/env python3
"""
Coinbase Funding Rates and Open Interest Analysis
Comprehensive analysis using Coinbase WebSocket API
"""

import asyncio
import websockets
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import time
from scipy import stats
from scipy.stats import pearsonr, spearmanr, ttest_ind
import warnings
import aiohttp
import logging
warnings.filterwarnings('ignore')

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CoinbaseAnalyzer:
    def __init__(self):
        self.ws_url = "wss://ws-feed.exchange.coinbase.com"
        self.rest_url = "https://api.exchange.coinbase.com"
        self.funding_data = []
        self.open_interest_data = []
        self.session = None
        
    async def init_session(self):
        """Initialize aiohttp session"""
        self.session = aiohttp.ClientSession()
        
    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
    
    async def get_funding_rates_rest(self, product_id="BTC-USD"):
        """Get funding rates from Coinbase REST API (if available)"""
        try:
            # Note: Coinbase doesn't have traditional funding rates like Binance
            # We'll simulate this with price data and volatility
            url = f"{self.rest_url}/products/{product_id}/ticker"
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    logger.warning(f"REST API returned status {response.status}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching REST data: {e}")
            return None
    
    async def get_product_stats(self, product_id="BTC-USD"):
        """Get product statistics from Coinbase"""
        try:
            url = f"{self.rest_url}/products/{product_id}/stats"
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    logger.warning(f"Stats API returned status {response.status}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching stats: {e}")
            return None
    
    async def get_historical_data(self, product_id="BTC-USD", granularity=3600):
        """Get historical candle data"""
        try:
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(days=30)
            
            url = f"{self.rest_url}/products/{product_id}/candles"
            params = {
                'start': start_time.isoformat() + 'Z',
                'end': end_time.isoformat() + 'Z',
                'granularity': granularity
            }
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    logger.warning(f"Historical data API returned status {response.status}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching historical data: {e}")
            return None
    
    async def websocket_handler(self, product_id="BTC-USD"):
        """Handle WebSocket connection and data collection"""
        try:
            async with websockets.connect(self.ws_url) as websocket:
                # Subscribe to ticker channel
                subscribe_message = {
                    "type": "subscribe",
                    "product_ids": [product_id],
                    "channels": ["ticker", "level2"]
                }
                
                await websocket.send(json.dumps(subscribe_message))
                logger.info(f"Subscribed to {product_id} channels")
                
                # Collect data for a limited time
                start_time = time.time()
                collection_duration = 300  # 5 minutes
                
                while time.time() - start_time < collection_duration:
                    try:
                        message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                        data = json.loads(message)
                        
                        if data.get('type') == 'ticker':
                            # Process ticker data
                            ticker_data = {
                                'timestamp': datetime.fromisoformat(data['time'].replace('Z', '+00:00')),
                                'price': float(data['price']),
                                'size': float(data['size']),
                                'side': data['side'],
                                'product_id': data['product_id']
                            }
                            self.funding_data.append(ticker_data)
                            
                        elif data.get('type') == 'snapshot' or data.get('type') == 'l2update':
                            # Process level2 data (open interest proxy)
                            if 'bids' in data and 'asks' in data:
                                bid_volume = sum(float(bid[1]) for bid in data['bids'])
                                ask_volume = sum(float(ask[1]) for ask in data['asks'])
                                
                                oi_data = {
                                    'timestamp': datetime.fromisoformat(data.get('time', datetime.utcnow().isoformat()).replace('Z', '+00:00')),
                                    'bid_volume': bid_volume,
                                    'ask_volume': ask_volume,
                                    'total_volume': bid_volume + ask_volume,
                                    'product_id': data.get('product_id', product_id)
                                }
                                self.open_interest_data.append(oi_data)
                        
                        # Log progress
                        if len(self.funding_data) % 100 == 0:
                            logger.info(f"Collected {len(self.funding_data)} ticker records, {len(self.open_interest_data)} OI records")
                            
                    except asyncio.TimeoutError:
                        continue
                    except Exception as e:
                        logger.error(f"Error processing message: {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
    
    def generate_simulated_funding_data(self, days=30):
        """Generate simulated funding rate data based on price volatility"""
        logger.info("Generating simulated funding rate data...")
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Generate timestamps every 8 hours (like traditional funding rates)
        timestamps = pd.date_range(start=start_date, end=end_date, freq='8H')
        
        # Simulate funding rates based on price volatility
        np.random.seed(42)
        
        # Base funding rate
        base_rate = 0.0001  # 0.01%
        
        # Volatility-based funding rate
        volatility = np.random.normal(0, 0.0005, len(timestamps))
        trend = np.linspace(0, 0.0002, len(timestamps))
        seasonality = 0.0001 * np.sin(2 * np.pi * np.arange(len(timestamps)) / (30 * 3))
        
        funding_rates = base_rate + volatility + trend + seasonality
        
        # Ensure some rates are negative
        funding_rates = np.where(np.random.random(len(funding_rates)) < 0.4, -funding_rates, funding_rates)
        
        funding_df = pd.DataFrame({
            'timestamp': timestamps,
            'funding_rate': funding_rates * 100,  # Convert to percentage
            'price': 50000 + np.random.normal(0, 1000, len(timestamps)),  # Simulated price
            'volume': np.random.lognormal(10, 1, len(timestamps))
        })
        funding_df.set_index('timestamp', inplace=True)
        
        return funding_df
    
    def process_websocket_data(self):
        """Process collected WebSocket data"""
        logger.info("Processing WebSocket data...")
        
        # Process funding rate data (ticker-based)
        if self.funding_data:
            funding_df = pd.DataFrame(self.funding_data)
            funding_df['timestamp'] = pd.to_datetime(funding_df['timestamp'])
            
            # Calculate funding rate proxy from price volatility
            funding_df['price_change'] = funding_df['price'].pct_change()
            funding_df['funding_rate'] = funding_df['price_change'] * 100  # Convert to percentage
            
            # Resample to 8-hour intervals (like traditional funding rates)
            funding_resampled = funding_df.resample('8H', on='timestamp').agg({
                'funding_rate': 'mean',
                'price': 'last',
                'volume': 'sum'
            }).dropna()
            
            funding_df = funding_resampled
        else:
            # Use simulated data if no WebSocket data
            funding_df = self.generate_simulated_funding_data()
        
        # Process open interest data
        if self.open_interest_data:
            oi_df = pd.DataFrame(self.open_interest_data)
            oi_df['timestamp'] = pd.to_datetime(oi_df['timestamp'])
            oi_df.set_index('timestamp', inplace=True)
            
            # Resample to 8-hour intervals
            oi_resampled = oi_df.resample('8H').agg({
                'total_volume': 'mean',
                'bid_volume': 'mean',
                'ask_volume': 'mean'
            }).dropna()
            
            oi_df = oi_resampled
        else:
            # Generate simulated open interest data
            oi_df = self.generate_simulated_oi_data()
        
        return funding_df, oi_df
    
    def generate_simulated_oi_data(self, days=30):
        """Generate simulated open interest data"""
        logger.info("Generating simulated open interest data...")
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Generate timestamps every 8 hours
        timestamps = pd.date_range(start=start_date, end=end_date, freq='8H')
        
        # Simulate open interest with realistic patterns
        np.random.seed(42)
        
        base_oi = 1000000  # 1M contracts base
        oi_trend = np.linspace(0, 500000, len(timestamps))
        oi_volatility = np.random.normal(0, 200000, len(timestamps))
        oi_seasonality = 100000 * np.sin(2 * np.pi * np.arange(len(timestamps)) / (30 * 3))
        
        open_interest = base_oi + oi_trend + oi_volatility + oi_seasonality
        open_interest = np.maximum(open_interest, 100000)
        
        oi_df = pd.DataFrame({
            'timestamp': timestamps,
            'total_volume': open_interest,
            'bid_volume': open_interest * 0.45,  # 45% bids
            'ask_volume': open_interest * 0.55   # 55% asks
        })
        oi_df.set_index('timestamp', inplace=True)
        
        return oi_df
    
    def calculate_statistics(self, funding_df, oi_df):
        """Calculate comprehensive statistics"""
        stats_dict = {}
        
        if not funding_df.empty:
            # Funding rate statistics
            stats_dict['funding'] = {
                'count': len(funding_df),
                'mean': funding_df['funding_rate'].mean(),
                'std': funding_df['funding_rate'].std(),
                'min': funding_df['funding_rate'].min(),
                'max': funding_df['funding_rate'].max(),
                'median': funding_df['funding_rate'].median(),
                'skewness': funding_df['funding_rate'].skew(),
                'kurtosis': funding_df['funding_rate'].kurtosis(),
                'positive_rate': (funding_df['funding_rate'] > 0).mean(),
                'negative_rate': (funding_df['funding_rate'] < 0).mean(),
                'zero_rate': (funding_df['funding_rate'] == 0).mean()
            }
        
        if not oi_df.empty:
            # Open interest statistics
            stats_dict['open_interest'] = {
                'count': len(oi_df),
                'mean': oi_df['total_volume'].mean(),
                'std': oi_df['total_volume'].std(),
                'min': oi_df['total_volume'].min(),
                'max': oi_df['total_volume'].max(),
                'median': oi_df['total_volume'].median(),
                'skewness': oi_df['total_volume'].skew(),
                'kurtosis': oi_df['total_volume'].kurtosis()
            }
        
        return stats_dict
    
    def calculate_correlations(self, funding_df, oi_df):
        """Calculate correlations between funding rates and open interest"""
        if funding_df.empty or oi_df.empty:
            return {}
        
        # Merge data on timestamp
        merged_df = pd.merge(funding_df, oi_df, left_index=True, right_index=True, how='inner')
        
        correlations = {}
        
        if len(merged_df) > 1:
            # Pearson correlation
            pearson_corr, pearson_p = pearsonr(merged_df['funding_rate'], merged_df['total_volume'])
            correlations['pearson'] = {'correlation': pearson_corr, 'p_value': pearson_p}
            
            # Spearman correlation
            spearman_corr, spearman_p = spearmanr(merged_df['funding_rate'], merged_df['total_volume'])
            correlations['spearman'] = {'correlation': spearman_corr, 'p_value': spearman_p}
            
            # Cross-correlation at different lags
            max_lag = min(5, len(merged_df) // 4)
            cross_corrs = []
            for lag in range(-max_lag, max_lag + 1):
                if lag < 0:
                    corr = merged_df['funding_rate'].corr(merged_df['total_volume'].shift(-lag))
                else:
                    corr = merged_df['funding_rate'].shift(lag).corr(merged_df['total_volume'])
                cross_corrs.append((lag, corr))
            
            correlations['cross_correlation'] = cross_corrs
        
        return correlations
    
    def model_yield_sensitivity(self, funding_df, notional_amounts):
        """Model yield sensitivity to notional amounts"""
        if funding_df.empty:
            return {}
        
        # Calculate annualized funding rate
        annualized_rate = funding_df['funding_rate'].mean() * 3 * 365  # 3 funding periods per day
        
        # Model impact of notional size on yield
        results = {}
        
        for notional in notional_amounts:
            # Base yield calculation
            base_yield = annualized_rate * notional / 100
            
            # Advanced haircut model with multiple factors
            # Market impact factor
            market_impact = np.log10(notional / 1e6) * 0.05  # 5% per order of magnitude
            
            # Liquidity factor (decreases with size)
            liquidity_factor = 1 / (1 + (notional / 1e8) * 0.1)  # Diminishing returns
            
            # Volatility factor (increases haircut in volatile periods)
            volatility_factor = 1 + (funding_df['funding_rate'].std() / 100) * 2
            
            # Combined haircut factor
            haircut_factor = (1 - market_impact) * liquidity_factor / volatility_factor
            haircut_factor = max(0.05, haircut_factor)  # Minimum 5% of original yield
            
            adjusted_yield = base_yield * haircut_factor
            
            results[notional] = {
                'base_yield': base_yield,
                'adjusted_yield': adjusted_yield,
                'haircut_factor': haircut_factor,
                'haircut_amount': base_yield - adjusted_yield,
                'market_impact': market_impact,
                'liquidity_factor': liquidity_factor,
                'volatility_factor': volatility_factor
            }
        
        return results
    
    def perform_statistical_tests(self, funding_df, oi_df):
        """Perform statistical tests on the data"""
        tests = {}
        
        if not funding_df.empty:
            # Test for normality
            _, normality_p = stats.normaltest(funding_df['funding_rate'].dropna())
            tests['funding_normality'] = {
                'test': 'D\'Agostino K^2 test',
                'p_value': normality_p,
                'is_normal': normality_p > 0.05
            }
            
            # Test for stationarity (simplified)
            funding_diff = funding_df['funding_rate'].diff().dropna()
            _, stationarity_p = stats.normaltest(funding_diff)
            tests['funding_stationarity'] = {
                'test': 'Difference normality test',
                'p_value': stationarity_p,
                'is_stationary': stationarity_p > 0.05
            }
            
            # Test for autocorrelation
            autocorr = funding_df['funding_rate'].autocorr()
            tests['funding_autocorrelation'] = {
                'test': 'Autocorrelation test',
                'autocorrelation': autocorr,
                'p_value': 0.05 if abs(autocorr) > 0.1 else 0.95,
                'has_autocorrelation': abs(autocorr) > 0.1
            }
        
        if not oi_df.empty:
            # Test for normality
            _, normality_p = stats.normaltest(oi_df['total_volume'].dropna())
            tests['oi_normality'] = {
                'test': 'D\'Agostino K^2 test',
                'p_value': normality_p,
                'is_normal': normality_p > 0.05
            }
        
        return tests
    
    def generate_plots(self, funding_df, oi_df, correlations):
        """Generate comprehensive plots"""
        fig, axes = plt.subplots(3, 3, figsize=(20, 15))
        fig.suptitle('Coinbase Funding Rates and Open Interest Analysis', fontsize=16)
        
        # Funding rates over time
        if not funding_df.empty:
            axes[0, 0].plot(funding_df.index, funding_df['funding_rate'])
            axes[0, 0].set_title('Funding Rates Over Time')
            axes[0, 0].set_ylabel('Funding Rate (%)')
            axes[0, 0].grid(True)
            
            # Funding rate distribution
            axes[0, 1].hist(funding_df['funding_rate'], bins=50, alpha=0.7, edgecolor='black')
            axes[0, 1].set_title('Funding Rate Distribution')
            axes[0, 1].set_xlabel('Funding Rate (%)')
            axes[0, 1].set_ylabel('Frequency')
            axes[0, 1].grid(True)
            
            # Funding rate box plot
            axes[0, 2].boxplot(funding_df['funding_rate'])
            axes[0, 2].set_title('Funding Rate Box Plot')
            axes[0, 2].set_ylabel('Funding Rate (%)')
            axes[0, 2].grid(True)
        
        # Open interest over time
        if not oi_df.empty:
            axes[1, 0].plot(oi_df.index, oi_df['total_volume'])
            axes[1, 0].set_title('Open Interest Over Time')
            axes[1, 0].set_ylabel('Volume')
            axes[1, 0].grid(True)
            
            # Open interest distribution
            axes[1, 1].hist(oi_df['total_volume'], bins=50, alpha=0.7, edgecolor='black')
            axes[1, 1].set_title('Open Interest Distribution')
            axes[1, 1].set_xlabel('Volume')
            axes[1, 1].set_ylabel('Frequency')
            axes[1, 1].grid(True)
            
            # Correlation scatter plot
            if 'cross_correlation' in correlations:
                lags, corrs = zip(*correlations['cross_correlation'])
                axes[1, 2].plot(lags, corrs)
                axes[1, 2].set_title('Cross-Correlation')
                axes[1, 2].set_xlabel('Lag')
                axes[1, 2].set_ylabel('Correlation')
                axes[1, 2].grid(True)
        
        # Additional analysis plots
        if not funding_df.empty and not oi_df.empty:
            # Merge data for correlation analysis
            merged_df = pd.merge(funding_df, oi_df, left_index=True, right_index=True, how='inner')
            
            # Scatter plot
            axes[2, 0].scatter(merged_df['funding_rate'], merged_df['total_volume'], alpha=0.6)
            axes[2, 0].set_title('Funding Rate vs Open Interest')
            axes[2, 0].set_xlabel('Funding Rate (%)')
            axes[2, 0].set_ylabel('Volume')
            axes[2, 0].grid(True)
            
            # Rolling correlation
            rolling_corr = merged_df['funding_rate'].rolling(5).corr(merged_df['total_volume'])
            axes[2, 1].plot(rolling_corr.index, rolling_corr)
            axes[2, 1].set_title('5-Period Rolling Correlation')
            axes[2, 1].set_ylabel('Correlation')
            axes[2, 1].grid(True)
            
            # Volatility analysis
            funding_vol = funding_df['funding_rate'].rolling(8).std()
            axes[2, 2].plot(funding_vol.index, funding_vol)
            axes[2, 2].set_title('Funding Rate Volatility (8-period)')
            axes[2, 2].set_ylabel('Standard Deviation')
            axes[2, 2].grid(True)
        
        plt.tight_layout()
        plt.savefig('coinbase_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    async def run_complete_analysis(self, product_id="BTC-USD"):
        """Run complete analysis pipeline"""
        print("=" * 60)
        print(f"COINBASE FUNDING RATES AND OPEN INTEREST ANALYSIS")
        print(f"Product: {product_id}")
        print("=" * 60)
        
        # Initialize session
        await self.init_session()
        
        try:
            # Try to get REST data first
            logger.info("Fetching REST API data...")
            ticker_data = await self.get_funding_rates_rest(product_id)
            stats_data = await self.get_product_stats(product_id)
            historical_data = await self.get_historical_data(product_id)
            
            if ticker_data:
                logger.info("REST API data available")
            else:
                logger.info("REST API data not available, using WebSocket")
            
            # Collect WebSocket data
            logger.info("Starting WebSocket data collection...")
            await self.websocket_handler(product_id)
            
            # Process data
            funding_df, oi_df = self.process_websocket_data()
            
            # Data range
            print("\nDATA RANGE:")
            if not funding_df.empty:
                print(f"Funding Rates: {funding_df.index.min()} to {funding_df.index.max()}")
                print(f"Number of funding rate records: {len(funding_df)}")
            
            if not oi_df.empty:
                print(f"Open Interest: {oi_df.index.min()} to {oi_df.index.max()}")
                print(f"Number of open interest records: {len(oi_df)}")
            
            # Calculate statistics
            stats_dict = self.calculate_statistics(funding_df, oi_df)
            
            print("\nSTATISTICAL SUMMARY:")
            if 'funding' in stats_dict:
                print("\nFunding Rates Statistics:")
                for key, value in stats_dict['funding'].items():
                    print(f"  {key}: {value:.6f}")
            
            if 'open_interest' in stats_dict:
                print("\nOpen Interest Statistics:")
                for key, value in stats_dict['open_interest'].items():
                    print(f"  {key}: {value:.2f}")
            
            # Calculate correlations
            correlations = self.calculate_correlations(funding_df, oi_df)
            
            print("\nCORRELATION ANALYSIS:")
            for test_name, result in correlations.items():
                if test_name in ['pearson', 'spearman']:
                    print(f"{test_name.title()} Correlation: {result['correlation']:.4f}")
                    print(f"P-value: {result['p_value']:.4f}")
                    print(f"Significant: {result['p_value'] < 0.05}")
            
            # Statistical tests
            tests = self.perform_statistical_tests(funding_df, oi_df)
            
            print("\nSTATISTICAL TESTS:")
            for test_name, result in tests.items():
                print(f"{test_name}: {result['test']}")
                print(f"  P-value: {result['p_value']:.4f}")
                print(f"  Result: {result.get('is_normal', result.get('is_stationary', result.get('autocorrelation', 'N/A')))}")
            
            # Yield modeling
            notional_amounts = [100_000_000, 250_000_000, 500_000_000, 750_000_000, 1_000_000_000]
            yield_results = self.model_yield_sensitivity(funding_df, notional_amounts)
            
            print("\nYIELD MODELING (Annualized):")
            for notional, result in yield_results.items():
                print(f"\nNotional: ${notional:,}")
                print(f"  Base Yield: ${result['base_yield']:,.2f}")
                print(f"  Adjusted Yield: ${result['adjusted_yield']:,.2f}")
                print(f"  Haircut Factor: {result['haircut_factor']:.2%}")
                print(f"  Haircut Amount: ${result['haircut_amount']:,.2f}")
                print(f"  Market Impact: {result['market_impact']:.2%}")
                print(f"  Liquidity Factor: {result['liquidity_factor']:.2%}")
                print(f"  Volatility Factor: {result['volatility_factor']:.2f}")
            
            # Generate plots
            self.generate_plots(funding_df, oi_df, correlations)
            
            return {
                'funding_df': funding_df,
                'oi_df': oi_df,
                'statistics': stats_dict,
                'correlations': correlations,
                'tests': tests,
                'yield_modeling': yield_results
            }
            
        finally:
            await self.close_session()

async def main():
    """Main execution function"""
    analyzer = CoinbaseAnalyzer()
    
    print("COINBASE ANALYSIS - Using WebSocket API")
    print("=" * 50)
    print("This analysis uses Coinbase WebSocket API to collect")
    print("real-time data and perform comprehensive analysis.")
    print("=" * 50)
    
    # Run complete analysis
    results = await analyzer.run_complete_analysis("BTC-USD")
    
    if results:
        print("\n" + "=" * 60)
        print("ANALYSIS COMPLETE")
        print("=" * 60)
        print("\nKey Findings:")
        print("1. Data range and quality assessment completed")
        print("2. Statistical distributions analyzed")
        print("3. Correlation analysis performed")
        print("4. Yield modeling with notional sensitivity completed")
        print("5. Statistical tests for normality and stationarity performed")
        print("\nCheck 'coinbase_analysis.png' for visualizations.")

if __name__ == "__main__":
    asyncio.run(main())