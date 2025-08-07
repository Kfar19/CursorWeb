# Binance Funding Rates and Open Interest Analysis

## Overview

This comprehensive analysis examines Binance funding rates and open interest data to model expected yields for funding rate arbitrage strategies. The analysis includes statistical modeling, correlation analysis, and yield sensitivity modeling for notional amounts between $100M and $1B.

## API Access

**No API key required** - The Binance Futures API endpoints used are public and do not require authentication:
- Funding rates: `https://fapi.binance.com/fapi/v1/fundingRate`
- Open interest: `https://fapi.binance.com/fapi/v1/openInterestHist`

## Data Collection

### Funding Rates
- **Frequency**: Every 8 hours (00:00, 08:00, 16:00 UTC)
- **Data Points**: Historical funding rates for the specified symbol
- **Range**: Up to 1 year of historical data
- **Format**: Percentage rates (converted from decimal)

### Open Interest
- **Frequency**: 5-minute intervals
- **Data Points**: Total open interest and open interest value
- **Range**: Up to 1 year of historical data
- **Format**: Raw contract quantities and USD values

## Statistical Analysis

### 1. Descriptive Statistics
- **Mean, Median, Standard Deviation**: Central tendency and dispersion measures
- **Skewness**: Measure of distribution asymmetry
- **Kurtosis**: Measure of distribution "tailedness"
- **Min/Max**: Range of observed values
- **Positive/Negative Rate Proportions**: Frequency of positive vs negative funding rates

### 2. Distribution Analysis
- **Normality Tests**: D'Agostino K² test for normal distribution
- **Stationarity Tests**: Difference-based normality tests
- **Histogram Analysis**: Visual distribution examination
- **Box Plot Analysis**: Outlier detection and quartile analysis

### 3. Correlation Analysis
- **Pearson Correlation**: Linear correlation coefficient
- **Spearman Correlation**: Rank-based correlation coefficient
- **Cross-Correlation**: Lag-based correlation analysis
- **P-Value Testing**: Statistical significance assessment

## Yield Modeling

### Base Yield Calculation
```
Annualized Yield = Average Funding Rate × 3 × 365
```
Where:
- 3 = funding periods per day (every 8 hours)
- 365 = days per year

### Notional Sensitivity Model
The analysis implements a haircut model that accounts for market impact as notional size increases:

```
Haircut Factor = 1 - (log₁₀(Notional/1M) × 0.1)
Adjusted Yield = Base Yield × Haircut Factor
```

**Assumptions:**
- 10% haircut per order of magnitude increase in notional
- Minimum haircut factor of 10% (90% maximum reduction)
- Linear logarithmic relationship

### Mathematical Methods Used

#### 1. Correlation Analysis
- **Pearson Correlation**: Measures linear relationship between variables
- **Spearman Correlation**: Measures monotonic relationship (rank-based)
- **Cross-Correlation**: Examines relationships at different time lags

#### 2. Statistical Tests
- **D'Agostino K² Test**: Tests for normal distribution
- **T-Test**: Compares means between groups
- **P-Value Analysis**: Determines statistical significance

#### 3. Yield Modeling
- **Logarithmic Haircut Model**: Accounts for market depth impact
- **Sensitivity Analysis**: Examines yield changes with notional size
- **Risk-Adjusted Returns**: Incorporates market impact considerations

## Data Quality Assessment

### Data Range
- **Funding Rates**: Typically 1 year of historical data
- **Open Interest**: 5-minute intervals over 1 year
- **Data Completeness**: Assessment of missing data points
- **Outlier Detection**: Identification of anomalous values

### Data Processing
- **Timestamp Alignment**: Resampling to 8-hour intervals for correlation analysis
- **Missing Data Handling**: Forward fill for gaps
- **Outlier Treatment**: Statistical outlier identification
- **Data Validation**: Range and format verification

## Risk Considerations

### Market Impact
- **Slippage**: Expected price impact of large orders
- **Liquidity Constraints**: Market depth limitations
- **Correlation Risk**: Relationship between funding rates and open interest

### Model Limitations
- **Historical Bias**: Past performance may not predict future results
- **Market Regime Changes**: Different market conditions may affect relationships
- **Liquidity Assumptions**: Model assumes sufficient market depth
- **Correlation Stability**: Relationships may change over time

## Usage Instructions

### Installation
```bash
pip install -r requirements.txt
```

### Running the Analysis
```bash
python binance_analysis.py
```

### Output Files
- **Console Output**: Statistical summaries and analysis results
- **binance_analysis.png**: Comprehensive visualization plots
- **Data Export**: Processed dataframes for further analysis

## Interpretation Guidelines

### Funding Rate Analysis
- **Positive Rates**: Indicate long positions pay shorts
- **Negative Rates**: Indicate short positions pay longs
- **Zero Rates**: Balanced market conditions
- **Volatility**: High standard deviation indicates unstable funding environment

### Open Interest Analysis
- **Trending**: Increasing OI suggests growing market participation
- **Contrarian**: Decreasing OI may indicate market exhaustion
- **Correlation**: Relationship with funding rates indicates market dynamics

### Yield Modeling
- **Base Yield**: Theoretical yield without market impact
- **Adjusted Yield**: Realistic yield accounting for market impact
- **Haircut Factor**: Reduction in yield due to notional size
- **Sensitivity**: How yield changes with different notional amounts

## Advanced Analysis Options

### Customization
- **Symbol Selection**: Change from SUIUSDT to other symbols
- **Time Range**: Modify historical data period
- **Notional Amounts**: Adjust sensitivity analysis range
- **Statistical Tests**: Add additional statistical methods

### Model Enhancements
- **Machine Learning**: Implement ML-based yield prediction
- **Regime Detection**: Identify different market regimes
- **Volatility Modeling**: Incorporate volatility forecasts
- **Risk Metrics**: Add VaR and other risk measures

## Disclaimer

This analysis is for educational and research purposes only. Past performance does not guarantee future results. The yield modeling is based on historical data and may not accurately predict future performance. Always conduct thorough due diligence and consider professional financial advice before implementing any trading strategies.

## Technical Notes

### API Rate Limits
- Binance public API: 1200 requests per minute
- Implemented rate limiting: 0.1 second delays between requests
- Batch processing: 30-day chunks for historical data

### Data Quality
- Missing data handling: Forward fill for gaps
- Outlier detection: Statistical methods for anomaly identification
- Data validation: Range and format verification

### Performance Considerations
- Memory usage: Optimized for large datasets
- Processing time: Parallel processing where possible
- Storage: Efficient data structures for analysis