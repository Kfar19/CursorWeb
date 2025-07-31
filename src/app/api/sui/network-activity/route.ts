import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

export async function GET() {
  try {
    // Mock data for now to get the dashboard working
    const mockData = {
      timestamp: Date.now(),
      networkStats: {
        currentCheckpoint: 12345678,
        totalValidators: 100,
        referenceGasPrice: 1000,
        totalSupply: 10000000000,
        activeAddresses: 45
      },
      transactionVolume: {
        totalTransactions: 50,
        totalVolume: 125.5,
        averageTransactionSize: 2.51,
        volumeByType: { 'All Transactions': 125.5 }
      },
      gasTrends: {
        currentGasPrice: 1000,
        averageGasUsed: 2500000,
        gasPriceHistory: [1000, 950, 1050, 980, 1020],
        gasUsageDistribution: {
          'Low (<1M)': 30,
          'Medium (1-5M)': 15,
          'High (>5M)': 5
        }
      },
      networkCongestion: {
        level: 'Medium',
        score: 2,
        gasPrice: 1000,
        averageGasUsed: 2500000,
        transactionCount: 50
      },
      defiActivity: [
        { name: 'Cetus', transactions: 5, volume: 12.55 },
        { name: 'Turbos', transactions: 3, volume: 6.28 },
        { name: 'SuiSwap', transactions: 2, volume: 3.77 }
      ],
      transactionTypes: {
        'Object Update': 35,
        'Smart Contract': 10,
        'Transfer': 5
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching network activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network activity' },
      { status: 500 }
    );
  }
}

function analyzeTransactions(transactions: any[]) {
  let totalVolume = 0;
  let totalGasUsed = 0;
  const volumeByType: { [key: string]: number } = {};
  const typeDistribution: { [key: string]: number } = {};
  const gasUsageDistribution: { [key: string]: number } = {};

  transactions.forEach(tx => {
    try {
      // Analyze transaction type
      const type = getTransactionType(tx);
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;

      // Analyze gas usage
      const gasUsed = tx.effects?.gasUsed?.computationCost || 0;
      totalGasUsed += gasUsed;

      // Categorize gas usage
      if (gasUsed < 1000000) gasUsageDistribution['Low (<1M)'] = (gasUsageDistribution['Low (<1M)'] || 0) + 1;
      else if (gasUsed < 5000000) gasUsageDistribution['Medium (1-5M)'] = (gasUsageDistribution['Medium (1-5M)'] || 0) + 1;
      else gasUsageDistribution['High (>5M)'] = (gasUsageDistribution['High (>5M)'] || 0) + 1;

      // Analyze volume (simplified - would need detailed transaction parsing)
      const volume = estimateTransactionVolume(tx);
      totalVolume += volume;
      volumeByType[type] = (volumeByType[type] || 0) + volume;
    } catch (error) {
      console.log('Error analyzing transaction:', error);
      // Continue with next transaction
    }
  });

  return {
    totalVolume,
    averageTransactionSize: totalVolume / transactions.length,
    averageGasUsed: totalGasUsed / transactions.length,
    volumeByType,
    typeDistribution,
    gasUsageDistribution
  };
}

function getTransactionType(tx: any): string {
  // Simplified type detection
  if (tx.transaction?.data?.transactions?.some((t: any) => t.PaySui)) return 'SUI Transfer';
  if (tx.transaction?.data?.transactions?.some((t: any) => t.MoveCall)) return 'Smart Contract';
  if (tx.objectChanges?.some((change: any) => change.type === 'transferred')) return 'Transfer';
  return 'Object Update';
}

function estimateTransactionVolume(tx: any): number {
  // Simplified volume estimation
  const gasUsed = tx.effects?.gasUsed?.computationCost || 0;
  // Assume higher gas usage correlates with larger transactions
  return gasUsed / 1000000; // Convert to approximate SUI value
}

function calculateNetworkCongestion(gasPrice: number, analysis: any) {
  const averageGasUsed = analysis.averageGasUsed;
  const totalTransactions = analysis.totalTransactions;

  // Calculate congestion level based on gas price and transaction volume
  let congestionLevel = 'Low';
  let congestionScore = 0;

  if (gasPrice > 1000) congestionScore += 2;
  if (averageGasUsed > 3000000) congestionScore += 1;
  if (totalTransactions > 500) congestionScore += 1;

  if (congestionScore >= 3) congestionLevel = 'High';
  else if (congestionScore >= 2) congestionLevel = 'Medium';

  return {
    level: congestionLevel,
    score: congestionScore,
    gasPrice: gasPrice,
    averageGasUsed: averageGasUsed,
    transactionCount: totalTransactions
  };
}

async function getDeFiActivity(transactions: any[]) {
  const defiProtocols = {
    'Cetus': { transactions: 0, volume: 0 },
    'Turbos': { transactions: 0, volume: 0 },
    'SuiSwap': { transactions: 0, volume: 0 },
    'Kriya': { transactions: 0, volume: 0 },
    'Aftermath': { transactions: 0, volume: 0 }
  };

  // Analyze transactions for DeFi activity
  transactions.forEach(tx => {
    try {
      const moveCalls = tx.transaction?.data?.transactions?.filter((t: any) => t.MoveCall) || [];
      
      moveCalls.forEach((call: any) => {
        const module = call.MoveCall?.module || '';
        const packageId = call.MoveCall?.package || '';

        // Check for known DeFi protocols
        if (packageId.includes('cetus') || module.includes('cetus')) {
          defiProtocols['Cetus'].transactions++;
          defiProtocols['Cetus'].volume += estimateTransactionVolume(tx);
        } else if (packageId.includes('turbos') || module.includes('turbos')) {
          defiProtocols['Turbos'].transactions++;
          defiProtocols['Turbos'].volume += estimateTransactionVolume(tx);
        } else if (packageId.includes('suiswap') || module.includes('suiswap')) {
          defiProtocols['SuiSwap'].transactions++;
          defiProtocols['SuiSwap'].volume += estimateTransactionVolume(tx);
        } else if (packageId.includes('kriya') || module.includes('kriya')) {
          defiProtocols['Kriya'].transactions++;
          defiProtocols['Kriya'].volume += estimateTransactionVolume(tx);
        } else if (packageId.includes('aftermath') || module.includes('aftermath')) {
          defiProtocols['Aftermath'].transactions++;
          defiProtocols['Aftermath'].volume += estimateTransactionVolume(tx);
        }
      });
    } catch (error) {
      console.log('Error analyzing DeFi activity:', error);
      // Continue with next transaction
    }
  });

  // Sort by transaction count
  const sortedProtocols = Object.entries(defiProtocols)
    .sort(([,a], [,b]) => b.transactions - a.transactions)
    .slice(0, 5);

  return sortedProtocols.map(([name, data]) => ({
    name,
    transactions: data.transactions,
    volume: data.volume
  }));
} 