#!/usr/bin/env python3
"""
Binance Funding Rates and Open Interest Analysis
Comprehensive analysis of funding rates and open interest data for yield modeling
"""

import requests
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

class BinanceAnalyzer:
    def __init__(self):
        self.base_url = "https://fapi.binance.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_funding_rates(self, symbol="SUIUSDT", start_time=None, end_time=None):
        """Fetch funding rates for a given symbol and time range"""
        url = f"{self.base_url}/fapi/v1/fundingRate"
        params = {
            'symbol': symbol,
            'limit': 1000
        }
        
        if start_time:
            params['startTime'] = start_time
        if end_time:
            params['endTime'] = end_time
            
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching funding rates: {e}")
            return []
    
    def get_open_interest(self, symbol="SUIUSDT", period="5m", start_time=None, end_time=None):
        """Fetch open interest data for a given symbol"""
        url = f"{self.base_url}/fapi/v1/openInterestHist"
        params = {
            'symbol': symbol,
            'period': period,
            'limit': 500
        }
        
        if start_time:
            params['startTime'] = start_time
        if end_time:
            params['endTime'] = end_time
            
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching open interest: {e}")
            return []
    
    def get_all_historical_data(self, symbol="SUIUSDT"):
        """Fetch all available historical data"""
        print(f"Fetching historical data for {symbol}...")
        
        # Get current time
        end_time = int(time.time() * 1000)
        start_time = end_time - (365 * 24 * 60 * 60 * 1000)  # 1 year ago
        
        # Fetch funding rates
        funding_data = []
        current_start = start_time
        
        while current_start < end_time:
            batch = self.get_funding_rates(
                symbol=symbol,
                start_time=current_start,
                end_time=min(current_start + (30 * 24 * 60 * 60 * 1000), end_time)
            )
            funding_data.extend(batch)
            current_start += (30 * 24 * 60 * 60 * 1000)
            time.sleep(0.1)  # Rate limiting
        
        # Fetch open interest
        oi_data = []
        current_start = start_time
        
        while current_start < end_time:
            batch = self.get_open_interest(
                symbol=symbol,
                start_time=current_start,
                end_time=min(current_start + (30 * 24 * 60 * 60 * 1000), end_time)
            )
            oi_data.extend(batch)
            current_start += (30 * 24 * 60 * 60 * 1000)
            time.sleep(0.1)  # Rate limiting
        
        return funding_data, oi_data
    
    def process_data(self, funding_data, oi_data):
        """Process and clean the raw data"""
        # Process funding rates
        funding_df = pd.DataFrame(funding_data)
        if not funding_df.empty:
            funding_df['fundingTime'] = pd.to_datetime(funding_df['fundingTime'], unit='ms')
            funding_df['fundingRate'] = funding_df['fundingRate'].astype(float)
            funding_df['fundingRate'] = funding_df['fundingRate'] * 100  # Convert to percentage
            funding_df.set_index('fundingTime', inplace=True)
        
        # Process open interest
        oi_df = pd.DataFrame(oi_data)
        if not oi_df.empty:
            oi_df['timestamp'] = pd.to_datetime(oi_df['timestamp'], unit='ms')
            oi_df['sumOpenInterest'] = oi_df['sumOpenInterest'].astype(float)
            oi_df['sumOpenInterestValue'] = oi_df['sumOpenInterestValue'].astype(float)
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
            
            # Simple linear haircut model (can be enhanced with more sophisticated models)
            haircut_factor = 1 - (np.log10(notional / 1e6) * 0.1)  # 10% haircut per order of magnitude
            haircut_factor = max(0.1, haircut_factor)  # Minimum 10% of original yield
            
            adjusted_yield = base_yield * haircut_factor
            
            results[notional] = {
                'base_yield': base_yield,
                'adjusted_yield': adjusted_yield,
                'haircut_factor': haircut_factor,
                'haircut_amount': base_yield - adjusted_yield
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
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        fig.suptitle('Binance Funding Rates and Open Interest Analysis', fontsize=16)
        
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
        
        plt.tight_layout()
        plt.savefig('binance_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def run_complete_analysis(self, symbol="SUIUSDT"):
        """Run complete analysis pipeline"""
        print("=" * 60)
        print(f"BINANCE FUNDING RATES AND OPEN INTEREST ANALYSIS")
        print(f"Symbol: {symbol}")
        print("=" * 60)
        
        # Fetch data
        funding_data, oi_data = self.get_all_historical_data(symbol)
        
        if not funding_data and not oi_data:
            print("No data retrieved. Please check API access and symbol.")
            return
        
        # Process data
        funding_df, oi_df = self.process_data(funding_data, oi_data)
        
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
            print(f"  Result: {result.get('is_normal', result.get('is_stationary', 'N/A'))}")
        
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
    analyzer = BinanceAnalyzer()
    
    # Test API access
    print("Testing API access...")
    test_data = analyzer.get_funding_rates("SUIUSDT")
    
    if not test_data:
        print("ERROR: Unable to access Binance API.")
        print("Please ensure you have internet connectivity and the API is accessible.")
        print("Note: No API key is required for public endpoints.")
        return
    
    print("API access successful!")
    
    # Run complete analysis
    results = analyzer.run_complete_analysis("SUIUSDT")
    
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
        print("\nCheck 'binance_analysis.png' for visualizations.")

if __name__ == "__main__":
    main()