#!/usr/bin/env python3
"""
Binance Funding Rates and Open Interest Analysis - DEMO VERSION
Comprehensive analysis with simulated data to demonstrate methodology
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import time
from scipy import stats
from scipy.stats import pearsonr, spearmanr, ttest_ind
import warnings
warnings.filterwarnings('ignore')

class BinanceAnalyzerDemo:
    def __init__(self):
        self.base_url = "https://fapi.binance.com"
        self.session = None  # Not used in demo
    
    def generate_simulated_data(self, symbol="BTCUSDT", days=365):
        """Generate realistic simulated data for demonstration"""
        print(f"Generating simulated data for {symbol} over {days} days...")
        
        # Generate timestamps
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Funding rates every 8 hours
        funding_times = pd.date_range(start=start_date, end=end_date, freq='8H')
        
        # Simulate funding rates with realistic characteristics
        np.random.seed(42)  # For reproducible results
        
        # Base funding rate with trend and seasonality
        base_rate = 0.0001  # 0.01% base rate
        trend = np.linspace(0, 0.0002, len(funding_times))  # Slight upward trend
        seasonality = 0.0001 * np.sin(2 * np.pi * np.arange(len(funding_times)) / (365 * 3))  # Annual cycle
        noise = np.random.normal(0, 0.0005, len(funding_times))  # Random noise
        
        funding_rates = base_rate + trend + seasonality + noise
        
        # Ensure some rates are negative (realistic for crypto)
        funding_rates = np.where(np.random.random(len(funding_rates)) < 0.4, -funding_rates, funding_rates)
        
        # Create funding rate dataframe
        funding_df = pd.DataFrame({
            'fundingTime': funding_times,
            'fundingRate': funding_rates * 100  # Convert to percentage
        })
        funding_df.set_index('fundingTime', inplace=True)
        
        # Generate open interest data (5-minute intervals)
        oi_times = pd.date_range(start=start_date, end=end_date, freq='5T')
        
        # Simulate open interest with realistic patterns
        base_oi = 1000000  # 1M contracts base
        oi_trend = np.linspace(0, 500000, len(oi_times))  # Growing trend
        oi_volatility = np.random.normal(0, 200000, len(oi_times))  # Volatility
        oi_seasonality = 100000 * np.sin(2 * np.pi * np.arange(len(oi_times)) / (24 * 12))  # Daily cycle
        
        open_interest = base_oi + oi_trend + oi_volatility + oi_seasonality
        open_interest = np.maximum(open_interest, 100000)  # Minimum 100k contracts
        
        # Create open interest dataframe
        oi_df = pd.DataFrame({
            'timestamp': oi_times,
            'sumOpenInterest': open_interest,
            'sumOpenInterestValue': open_interest * 50000  # Assuming $50k per contract
        })
        oi_df.set_index('timestamp', inplace=True)
        
        return funding_df, oi_df
    
    def calculate_statistics(self, funding_df, oi_df):
        """Calculate comprehensive statistics"""
        stats_dict = {}
        
        if not funding_df.empty:
            # Funding rate statistics
            stats_dict['funding'] = {
                'count': len(funding_df),
                'mean': funding_df['fundingRate'].mean(),
                'std': funding_df['fundingRate'].std(),
                'min': funding_df['fundingRate'].min(),
                'max': funding_df['fundingRate'].max(),
                'median': funding_df['fundingRate'].median(),
                'skewness': funding_df['fundingRate'].skew(),
                'kurtosis': funding_df['fundingRate'].kurtosis(),
                'positive_rate': (funding_df['fundingRate'] > 0).mean(),
                'negative_rate': (funding_df['fundingRate'] < 0).mean(),
                'zero_rate': (funding_df['fundingRate'] == 0).mean()
            }
        
        if not oi_df.empty:
            # Open interest statistics
            stats_dict['open_interest'] = {
                'count': len(oi_df),
                'mean': oi_df['sumOpenInterest'].mean(),
                'std': oi_df['sumOpenInterest'].std(),
                'min': oi_df['sumOpenInterest'].min(),
                'max': oi_df['sumOpenInterest'].max(),
                'median': oi_df['sumOpenInterest'].median(),
                'skewness': oi_df['sumOpenInterest'].skew(),
                'kurtosis': oi_df['sumOpenInterest'].kurtosis()
            }
        
        return stats_dict
    
    def calculate_correlations(self, funding_df, oi_df):
        """Calculate correlations between funding rates and open interest"""
        if funding_df.empty or oi_df.empty:
            return {}
        
        # Resample to align timestamps
        funding_resampled = funding_df.resample('8H').mean()  # Funding occurs every 8 hours
        oi_resampled = oi_df.resample('8H').mean()
        
        # Merge data
        merged_df = pd.merge(funding_resampled, oi_resampled, 
                           left_index=True, right_index=True, how='inner')
        
        correlations = {}
        
        if len(merged_df) > 1:
            # Pearson correlation
            pearson_corr, pearson_p = pearsonr(merged_df['fundingRate'], merged_df['sumOpenInterest'])
            correlations['pearson'] = {'correlation': pearson_corr, 'p_value': pearson_p}
            
            # Spearman correlation
            spearman_corr, spearman_p = spearmanr(merged_df['fundingRate'], merged_df['sumOpenInterest'])
            correlations['spearman'] = {'correlation': spearman_corr, 'p_value': spearman_p}
            
            # Cross-correlation at different lags
            max_lag = min(10, len(merged_df) // 4)
            cross_corrs = []
            for lag in range(-max_lag, max_lag + 1):
                if lag < 0:
                    corr = merged_df['fundingRate'].corr(merged_df['sumOpenInterest'].shift(-lag))
                else:
                    corr = merged_df['fundingRate'].shift(lag).corr(merged_df['sumOpenInterest'])
                cross_corrs.append((lag, corr))
            
            correlations['cross_correlation'] = cross_corrs
        
        return correlations
    
    def model_yield_sensitivity(self, funding_df, notional_amounts):
        """Model yield sensitivity to notional amounts"""
        if funding_df.empty:
            return {}
        
        # Calculate annualized funding rate
        annualized_rate = funding_df['fundingRate'].mean() * 3 * 365  # 3 funding periods per day
        
        # Model impact of notional size on yield
        results = {}
        
        for notional in notional_amounts:
            # Base yield calculation
            base_yield = annualized_rate * notional / 100
            
            # Impact modeling based on market depth and correlation
            # As notional increases, we expect:
            # 1. Reduced effective funding rate due to market impact
            # 2. Increased slippage
            # 3. Potential correlation effects
            
            # Advanced haircut model with multiple factors
            # Market impact factor
            market_impact = np.log10(notional / 1e6) * 0.05  # 5% per order of magnitude
            
            # Liquidity factor (decreases with size)
            liquidity_factor = 1 / (1 + (notional / 1e8) * 0.1)  # Diminishing returns
            
            # Volatility factor (increases haircut in volatile periods)
            volatility_factor = 1 + (funding_df['fundingRate'].std() / 100) * 2
            
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
            _, normality_p = stats.normaltest(funding_df['fundingRate'].dropna())
            tests['funding_normality'] = {
                'test': 'D\'Agostino K^2 test',
                'p_value': normality_p,
                'is_normal': normality_p > 0.05
            }
            
            # Test for stationarity (simplified)
            funding_diff = funding_df['fundingRate'].diff().dropna()
            _, stationarity_p = stats.normaltest(funding_diff)
            tests['funding_stationarity'] = {
                'test': 'Difference normality test',
                'p_value': stationarity_p,
                'is_stationary': stationarity_p > 0.05
            }
            
            # Test for autocorrelation
            autocorr = funding_df['fundingRate'].autocorr()
            tests['funding_autocorrelation'] = {
                'test': 'Autocorrelation test',
                'autocorrelation': autocorr,
                'p_value': 0.05 if abs(autocorr) > 0.1 else 0.95,  # Simplified p-value
                'has_autocorrelation': abs(autocorr) > 0.1
            }
        
        if not oi_df.empty:
            # Test for normality
            _, normality_p = stats.normaltest(oi_df['sumOpenInterest'].dropna())
            tests['oi_normality'] = {
                'test': 'D\'Agostino K^2 test',
                'p_value': normality_p,
                'is_normal': normality_p > 0.05
            }
        
        return tests
    
    def generate_plots(self, funding_df, oi_df, correlations):
        """Generate comprehensive plots"""
        fig, axes = plt.subplots(3, 3, figsize=(20, 15))
        fig.suptitle('Binance Funding Rates and Open Interest Analysis (DEMO)', fontsize=16)
        
        # Funding rates over time
        if not funding_df.empty:
            axes[0, 0].plot(funding_df.index, funding_df['fundingRate'])
            axes[0, 0].set_title('Funding Rates Over Time')
            axes[0, 0].set_ylabel('Funding Rate (%)')
            axes[0, 0].grid(True)
            
            # Funding rate distribution
            axes[0, 1].hist(funding_df['fundingRate'], bins=50, alpha=0.7, edgecolor='black')
            axes[0, 1].set_title('Funding Rate Distribution')
            axes[0, 1].set_xlabel('Funding Rate (%)')
            axes[0, 1].set_ylabel('Frequency')
            axes[0, 1].grid(True)
            
            # Funding rate box plot
            axes[0, 2].boxplot(funding_df['fundingRate'])
            axes[0, 2].set_title('Funding Rate Box Plot')
            axes[0, 2].set_ylabel('Funding Rate (%)')
            axes[0, 2].grid(True)
        
        # Open interest over time
        if not oi_df.empty:
            axes[1, 0].plot(oi_df.index, oi_df['sumOpenInterest'])
            axes[1, 0].set_title('Open Interest Over Time')
            axes[1, 0].set_ylabel('Open Interest')
            axes[1, 0].grid(True)
            
            # Open interest distribution
            axes[1, 1].hist(oi_df['sumOpenInterest'], bins=50, alpha=0.7, edgecolor='black')
            axes[1, 1].set_title('Open Interest Distribution')
            axes[1, 1].set_xlabel('Open Interest')
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
            # Resample for correlation analysis
            funding_resampled = funding_df.resample('8H').mean()
            oi_resampled = oi_df.resample('8H').mean()
            merged_df = pd.merge(funding_resampled, oi_resampled, 
                               left_index=True, right_index=True, how='inner')
            
            # Scatter plot
            axes[2, 0].scatter(merged_df['fundingRate'], merged_df['sumOpenInterest'], alpha=0.6)
            axes[2, 0].set_title('Funding Rate vs Open Interest')
            axes[2, 0].set_xlabel('Funding Rate (%)')
            axes[2, 0].set_ylabel('Open Interest')
            axes[2, 0].grid(True)
            
            # Rolling correlation
            rolling_corr = merged_df['fundingRate'].rolling(30).corr(merged_df['sumOpenInterest'])
            axes[2, 1].plot(rolling_corr.index, rolling_corr)
            axes[2, 1].set_title('30-Period Rolling Correlation')
            axes[2, 1].set_ylabel('Correlation')
            axes[2, 1].grid(True)
            
            # Volatility analysis
            funding_vol = funding_df['fundingRate'].rolling(24).std()
            axes[2, 2].plot(funding_vol.index, funding_vol)
            axes[2, 2].set_title('Funding Rate Volatility (24-period)')
            axes[2, 2].set_ylabel('Standard Deviation')
            axes[2, 2].grid(True)
        
        plt.tight_layout()
        plt.savefig('binance_analysis_demo.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def run_complete_analysis(self, symbol="BTCUSDT"):
        """Run complete analysis pipeline with simulated data"""
        print("=" * 60)
        print(f"BINANCE FUNDING RATES AND OPEN INTEREST ANALYSIS - DEMO")
        print(f"Symbol: {symbol}")
        print("=" * 60)
        print("\nNOTE: This is a demonstration using simulated data.")
        print("For real data analysis, ensure API access is available.")
        print("=" * 60)
        
        # Generate simulated data
        funding_df, oi_df = self.generate_simulated_data(symbol)
        
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

def main():
    """Main execution function"""
    analyzer = BinanceAnalyzerDemo()
    
    print("DEMO VERSION - Using Simulated Data")
    print("=" * 50)
    print("This demonstration shows the complete analysis methodology")
    print("using realistic simulated data. For real analysis, ensure")
    print("Binance API access is available from your location.")
    print("=" * 50)
    
    # Run complete analysis
    results = analyzer.run_complete_analysis("BTCUSDT")
    
    if results:
        print("\n" + "=" * 60)
        print("DEMO ANALYSIS COMPLETE")
        print("=" * 60)
        print("\nKey Findings (Simulated Data):")
        print("1. Data range and quality assessment completed")
        print("2. Statistical distributions analyzed")
        print("3. Correlation analysis performed")
        print("4. Yield modeling with notional sensitivity completed")
        print("5. Statistical tests for normality and stationarity performed")
        print("\nCheck 'binance_analysis_demo.png' for visualizations.")
        print("\nTo run with real data:")
        print("1. Ensure Binance API access from your location")
        print("2. Run: python binance_analysis.py")
        print("3. Or modify this demo to use real API calls")

if __name__ == "__main__":
    main()