import { NextResponse } from 'next/server';

interface CryptoPrice {
  [key: string]: number;
}

interface TreasuryCompany {
  company: string;
  crypto: string;
  ticker: string;
  cryptoOwned: number;
  yahoo: string;
  treasuryValue?: number;
  marketCap?: number;
  operatingCashFlow?: number;
  obligationRate?: number;
  shortPercent?: number;
  shortDays?: number;
  mNAV?: number;
}

// Mock crypto prices - in production, this would fetch from a crypto API
const getCryptoPrices = async (): Promise<CryptoPrice> => {
  // This would typically fetch from CoinGecko, CoinMarketCap, or similar
  // For now, using mock data
  return {
    'BTC': 97000,
    'ETH': 3500,
    'SOL': 180,
    'SUI': 4.2,
    'BNB': 580,
    'TRX': 0.12
  };
};

// Mock Yahoo Finance data scraper - in production, this would scrape actual data
const getYahooFinanceData = async (ticker: string) => {
  // This is mock data - in production, you'd scrape or use Yahoo Finance API
  const mockData: { [key: string]: any } = {
    'MSTR': {
      marketCapFromYahoo: 85000000000,
      sharesOutstanding: 22000000,
      lastPrice: 3863,
      operatingCashFlow: 150000000,
      shortPercent: 8.5,
      sharesShort: 1870000,
      avgVolume10Day: 8500000
    },
    'MARA': {
      marketCapFromYahoo: 8500000000,
      sharesOutstanding: 235000000,
      lastPrice: 36.17,
      operatingCashFlow: 75000000,
      shortPercent: 12.3,
      sharesShort: 28900000,
      avgVolume10Day: 12000000
    },
    'RIOT': {
      marketCapFromYahoo: 3200000000,
      sharesOutstanding: 135000000,
      lastPrice: 23.70,
      operatingCashFlow: 45000000,
      shortPercent: 15.7,
      sharesShort: 21200000,
      avgVolume10Day: 8200000
    },
    'BITF': {
      marketCapFromYahoo: 1800000000,
      sharesOutstanding: 425000000,
      lastPrice: 4.24,
      operatingCashFlow: 28000000,
      shortPercent: 18.2,
      sharesShort: 77350000,
      avgVolume10Day: 15000000
    },
    'HUT': {
      marketCapFromYahoo: 2100000000,
      sharesOutstanding: 175000000,
      lastPrice: 12.00,
      operatingCashFlow: 35000000,
      shortPercent: 14.8,
      sharesShort: 25900000,
      avgVolume10Day: 6800000
    },
    'CCCM': {
      marketCapFromYahoo: 450000000,
      sharesOutstanding: 45000000,
      lastPrice: 10.00,
      operatingCashFlow: 12000000,
      shortPercent: 22.1,
      sharesShort: 9945000,
      avgVolume10Day: 850000
    },
    'DJT': {
      marketCapFromYahoo: 7200000000,
      sharesOutstanding: 200000000,
      lastPrice: 36.00,
      operatingCashFlow: -25000000, // Negative cash flow
      shortPercent: 3.2,
      sharesShort: 6400000,
      avgVolume10Day: 18500000
    },
    'CEP': {
      marketCapFromYahoo: 1200000000,
      sharesOutstanding: 150000000,
      lastPrice: 8.00,
      operatingCashFlow: 20000000,
      shortPercent: 16.5,
      sharesShort: 24750000,
      avgVolume10Day: 3500000
    },
    'SBET': {
      marketCapFromYahoo: 2090000000, // Updated Yahoo market cap
      sharesOutstanding: 99960000, // Updated: 99.96M shares
      lastPrice: 20.92, // Updated: $20.92
      operatingCashFlow: 2500000,
      shortPercent: 28.5,
      sharesShort: 7125000,
      avgVolume10Day: 450000
    },
    'BMNR': {
      marketCapFromYahoo: 4470000000, // Updated Yahoo market cap
      sharesOutstanding: 127310000, // Updated: 127.31M shares
      lastPrice: 35.11, // Updated: $35.11
      operatingCashFlow: 1800000,
      shortPercent: 31.2,
      sharesShort: 12480000,
      avgVolume10Day: 680000
    },
    'UPXI': {
      marketCapFromYahoo: 269000000, // Updated Yahoo market cap
      sharesOutstanding: 53790000, // Updated: 53.79M shares
      lastPrice: 5.00,
      operatingCashFlow: 3200000,
      shortPercent: 19.8,
      sharesShort: 3762000,
      avgVolume10Day: 280000
    },
    'DFDV': {
      marketCapFromYahoo: 850000000,
      sharesOutstanding: 85000000,
      lastPrice: 10.00,
      operatingCashFlow: 15000000,
      shortPercent: 12.8,
      sharesShort: 10880000,
      avgVolume10Day: 1200000
    },
    'VAPE': {
      marketCapFromYahoo: 3200000000,
      sharesOutstanding: 80000000,
      lastPrice: 40.00,
      operatingCashFlow: 45000000,
      shortPercent: 8.9,
      sharesShort: 7120000,
      avgVolume10Day: 2500000
    },
    'MBAV': {
      marketCapFromYahoo: 1800000000,
      sharesOutstanding: 90000000,
      lastPrice: 20.00,
      operatingCashFlow: 25000000,
      shortPercent: 15.2,
      sharesShort: 13680000,
      avgVolume10Day: 1800000
    },
    'SRM.O': {
      marketCapFromYahoo: 15000000000,
      sharesOutstanding: 1000000000,
      lastPrice: 15.00,
      operatingCashFlow: 120000000,
      shortPercent: 5.8,
      sharesShort: 58000000,
      avgVolume10Day: 8500000
    }
  };

  return mockData[ticker] || null;
};

export async function GET() {
  try {
    const cryptoPrices = await getCryptoPrices();
    
    const companies: TreasuryCompany[] = [
      { company: 'Strategy', crypto: 'BTC', ticker: 'MSTR', cryptoOwned: 597325, yahoo: 'https://finance.yahoo.com/quote/MSTR/key-statistics/' },
      { company: 'Marathon Digital', crypto: 'BTC', ticker: 'MARA', cryptoOwned: 14402, yahoo: 'https://finance.yahoo.com/quote/MARA/key-statistics/' },
      { company: 'Riot Platforms', crypto: 'BTC', ticker: 'RIOT', cryptoOwned: 12530, yahoo: 'https://finance.yahoo.com/quote/RIOT/key-statistics/' },
      { company: 'Bitfarms', crypto: 'BTC', ticker: 'BITF', cryptoOwned: 11858, yahoo: 'https://finance.yahoo.com/quote/BITF/key-statistics/' },
      { company: 'Hut8', crypto: 'BTC', ticker: 'HUT', cryptoOwned: 5000, yahoo: 'https://finance.yahoo.com/quote/HUT/key-statistics/' },
      { company: 'ProCap | Columbus Circle', crypto: 'BTC', ticker: 'CCCM', cryptoOwned: 4717, yahoo: 'https://finance.yahoo.com/quote/CCCM/key-statistics/' },
      { company: 'Trump Media', crypto: 'BTC', ticker: 'DJT', cryptoOwned: 21186, yahoo: 'https://finance.yahoo.com/quote/DJT/key-statistics/' },
      { company: 'Twenty - One', crypto: 'BTC', ticker: 'CEP', cryptoOwned: 43500, yahoo: 'https://finance.yahoo.com/quote/CEP/key-statistics/' },
      { company: 'Sharplink Gaming', crypto: 'ETH', ticker: 'SBET', cryptoOwned: 390607, yahoo: 'https://finance.yahoo.com/quote/SBET/key-statistics/' },
      { company: 'Bitminer', crypto: 'ETH', ticker: 'BMNR', cryptoOwned: 566776, yahoo: 'https://finance.yahoo.com/quote/BMNR/key-statistics/' },
      { company: 'Upexi', crypto: 'SOL', ticker: 'UPXI', cryptoOwned: 2631579, yahoo: 'https://finance.yahoo.com/quote/UPXI/key-statistics/' },
      { company: 'Mill City', crypto: 'SUI', ticker: '', cryptoOwned: 0, yahoo: '' },
      { company: 'DeFi Dev Corp', crypto: 'SOL', ticker: 'DFDV', cryptoOwned: 1180000, yahoo: 'https://finance.yahoo.com/quote/DFDV/key-statistics/' },
      { company: 'YZi Labs', crypto: 'BNB', ticker: 'VAPE', cryptoOwned: 635324, yahoo: 'https://finance.yahoo.com/quote/VAPE/key-statistics/' },
      { company: 'ReserveOne', crypto: 'BTC, ETH, SOL', ticker: 'MBAV', cryptoOwned: 8475, yahoo: 'https://finance.yahoo.com/quote/MBAV/key-statistics/' },
      { company: 'Tron Inc', crypto: 'TRX', ticker: 'SRM.O', cryptoOwned: 303030303, yahoo: '' }
    ];

    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        // For companies with multiple cryptos, calculate total value
        let treasuryValue = 0;
        if (company.crypto.includes(',')) {
          const cryptos = company.crypto.split(',').map(c => c.trim());
          cryptos.forEach(crypto => {
            const price = cryptoPrices[crypto] || 0;
            // Distribute crypto owned equally among the cryptos
            treasuryValue += (company.cryptoOwned / cryptos.length) * price;
          });
        } else {
          const cryptoPrice = cryptoPrices[company.crypto] || 0;
          treasuryValue = company.cryptoOwned * cryptoPrice;
        }
        
        let enrichedCompany = {
          ...company,
          treasuryValue
        };

        // Only fetch Yahoo data for companies with tickers
        if (company.ticker) {
          try {
            const yahooData = await getYahooFinanceData(company.ticker);
            
            if (yahooData) {
              // Calculate computed Market Cap = sharesOutstanding * lastPrice
              const computedMarketCap = yahooData.sharesOutstanding * yahooData.lastPrice;
              
              // Use the larger of computed vs Yahoo market cap
              const marketCap = Math.max(computedMarketCap, yahooData.marketCapFromYahoo);
              
              // Operating Cash Flow (TTM)
              const operatingCashFlow = yahooData.operatingCashFlow;
              
              // Obligation Rate = Operating Cash Flow (TTM) / crypto value
              const obligationRate = treasuryValue > 0 ? operatingCashFlow / treasuryValue : 0;
              
              // Short % of Float
              const shortPercent = yahooData.shortPercent;
              
              // Short volume days = Shares Short / Avg Vol (10 day)
              const shortDays = yahooData.avgVolume10Day > 0 ? yahooData.sharesShort / yahooData.avgVolume10Day : 0;

              // mNAV = Market Cap / Treasury Value
              const mNAV = treasuryValue > 0 ? marketCap / treasuryValue : 0;

              enrichedCompany = {
                ...enrichedCompany,
                marketCap,
                operatingCashFlow,
                obligationRate,
                shortPercent,
                shortDays,
                mNAV
              };
            }
          } catch (error) {
            console.error(`Error fetching data for ${company.ticker}:`, error);
          }
        }

        return enrichedCompany;
      })
    );

    return NextResponse.json(enrichedCompanies);
  } catch (error) {
    console.error('Error fetching crypto treasury data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto treasury data' },
      { status: 500 }
    );
  }
}