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
}

// Mock crypto prices - in production, this would fetch from a crypto API
const getCryptoPrices = async (): Promise<CryptoPrice> => {
  // This would typically fetch from CoinGecko, CoinMarketCap, or similar
  // For now, using mock data
  return {
    'BTC': 97000,
    'ETH': 3500,
    'SOL': 180,
    'SUI': 4.2
  };
};

// Mock Yahoo Finance data scraper - in production, this would scrape actual data
const getYahooFinanceData = async (ticker: string) => {
  // This is mock data - in production, you'd scrape or use Yahoo Finance API
  interface YahooFinanceData {
    marketCap: number;
    sharesOutstanding: number;
    lastPrice: number;
    operatingCashFlow: number;
    shortPercent: number;
    sharesShort: number;
    avgVolume10Day: number;
  }

  const mockData: { [key: string]: YahooFinanceData } = {
    'MSTR': {
      marketCap: 85000000000,
      sharesOutstanding: 22000000,
      lastPrice: 3863,
      operatingCashFlow: 150000000,
      shortPercent: 8.5,
      sharesShort: 1870000,
      avgVolume10Day: 8500000
    },
    'MARA': {
      marketCap: 8500000000,
      sharesOutstanding: 235000000,
      lastPrice: 36.17,
      operatingCashFlow: 75000000,
      shortPercent: 12.3,
      sharesShort: 28900000,
      avgVolume10Day: 12000000
    },
    'RIOT': {
      marketCap: 3200000000,
      sharesOutstanding: 135000000,
      lastPrice: 23.70,
      operatingCashFlow: 45000000,
      shortPercent: 15.7,
      sharesShort: 21200000,
      avgVolume10Day: 8200000
    },
    'BITF': {
      marketCap: 1800000000,
      sharesOutstanding: 425000000,
      lastPrice: 4.24,
      operatingCashFlow: 28000000,
      shortPercent: 18.2,
      sharesShort: 77350000,
      avgVolume10Day: 15000000
    },
    'HUT': {
      marketCap: 2100000000,
      sharesOutstanding: 175000000,
      lastPrice: 12.00,
      operatingCashFlow: 35000000,
      shortPercent: 14.8,
      sharesShort: 25900000,
      avgVolume10Day: 6800000
    },
    'CCCM': {
      marketCap: 450000000,
      sharesOutstanding: 45000000,
      lastPrice: 10.00,
      operatingCashFlow: 12000000,
      shortPercent: 22.1,
      sharesShort: 9945000,
      avgVolume10Day: 850000
    },
    'DJT': {
      marketCap: 7200000000,
      sharesOutstanding: 200000000,
      lastPrice: 36.00,
      operatingCashFlow: -25000000, // Negative cash flow
      shortPercent: 3.2,
      sharesShort: 6400000,
      avgVolume10Day: 18500000
    },
    'SBET': {
      marketCap: 85000000,
      sharesOutstanding: 25000000,
      lastPrice: 3.40,
      operatingCashFlow: 2500000,
      shortPercent: 28.5,
      sharesShort: 7125000,
      avgVolume10Day: 450000
    },
    'BMNR': {
      marketCap: 120000000,
      sharesOutstanding: 40000000,
      lastPrice: 3.00,
      operatingCashFlow: 1800000,
      shortPercent: 31.2,
      sharesShort: 12480000,
      avgVolume10Day: 680000
    },
    'UPXI': {
      marketCap: 95000000,
      sharesOutstanding: 19000000,
      lastPrice: 5.00,
      operatingCashFlow: 3200000,
      shortPercent: 19.8,
      sharesShort: 3762000,
      avgVolume10Day: 280000
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
      { company: 'ProCap | Columbus Circle', crypto: 'BTC', ticker: 'CCCM', cryptoOwned: 4716.981132, yahoo: 'https://finance.yahoo.com/quote/CCCM/key-statistics/' },
      { company: 'Trump Media', crypto: 'BTC', ticker: 'DJT', cryptoOwned: 21186.44068, yahoo: 'https://finance.yahoo.com/quote/DJT/key-statistics/' },
      { company: 'Twenty - One', crypto: 'BTC', ticker: '', cryptoOwned: 4812, yahoo: '' },
      { company: 'Sharplink Gaming', crypto: 'ETH', ticker: 'SBET', cryptoOwned: 390607, yahoo: 'https://finance.yahoo.com/quote/SBET/key-statistics/' },
      { company: 'Bitminer', crypto: 'ETH', ticker: 'BMNR', cryptoOwned: 566776, yahoo: 'https://finance.yahoo.com/quote/BMNR/key-statistics/' },
      { company: 'Upexi', crypto: 'SOL', ticker: 'UPXI', cryptoOwned: 2631578.947, yahoo: 'https://finance.yahoo.com/quote/UPXI/key-statistics/' },
      { company: 'Mill City', crypto: 'SUI', ticker: '', cryptoOwned: 0, yahoo: '' }
    ];

    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const cryptoPrice = cryptoPrices[company.crypto] || 0;
        const treasuryValue = company.cryptoOwned * cryptoPrice;
        
        let enrichedCompany = {
          ...company,
          treasuryValue
        };

        // Only fetch Yahoo data for companies with tickers
        if (company.ticker) {
          try {
            const yahooData = await getYahooFinanceData(company.ticker);
            
            if (yahooData) {
              // Calculate NAV (Market Cap)
              const marketCap = yahooData.sharesOutstanding * yahooData.lastPrice;
              
              // Operating Cash Flow (TTM)
              const operatingCashFlow = yahooData.operatingCashFlow;
              
              // Obligation Rate = Operating Cash Flow (TTM) / crypto value
              const obligationRate = treasuryValue > 0 ? operatingCashFlow / treasuryValue : 0;
              
              // Short % of Float
              const shortPercent = yahooData.shortPercent;
              
              // Short volume days = Shares Short / Avg Vol (10 day)
              const shortDays = yahooData.avgVolume10Day > 0 ? yahooData.sharesShort / yahooData.avgVolume10Day : 0;

              enrichedCompany = {
                ...enrichedCompany,
                marketCap,
                operatingCashFlow,
                obligationRate,
                shortPercent,
                shortDays
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