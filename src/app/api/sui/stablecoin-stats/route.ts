import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

// Known stablecoin coin types on Sui (verified addresses)
const STABLECOIN_TYPES = {
  'USDC': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  'USDT': '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
};

export async function GET() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get current SUI price for USD conversion
    let suiPriceUSD = 0;
    try {
      const suiPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
      const suiPriceData = await suiPriceResponse.json();
      suiPriceUSD = suiPriceData.sui?.usd || 0;
    } catch (error) {
      console.error('Failed to fetch SUI price:', error);
    }

    // Get recent transactions for analysis
    const transactions = await client.queryTransactionBlocks({
      limit: 2000, // Much larger sample size to find stablecoin transactions
      order: 'descending'
    });

    console.log(`Fetched ${transactions.data.length} transactions from Sui mainnet`);

    let stablecoinStats: any = {
      totalTransactions: 0,
      totalVolumeUSD: 0,
      totalVolumeSUI: 0,
      usdcTransactions: 0,
      usdcVolumeUSD: 0,
      usdtTransactions: 0,
      usdtVolumeUSD: 0,
      suiTransactions: 0,
      suiVolumeSUI: 0,
      timestamp: Date.now(),
      dataSource: 'Sui Mainnet RPC',
      lastUpdated: new Date().toISOString(),
      sampleSize: transactions.data.length,
      analyzedTransactions: 0,
      transactionTypes: [],
      debugInfo: [],
      allCoinTypes: new Set(),
      recentTransactionDigests: []
    };

    // Analyze real transactions (process first 100 for speed)
    const transactionsToAnalyze = transactions.data.slice(0, 100);
    for (const tx of transactionsToAnalyze) {
      try {
        // Get detailed transaction information
        const txDetails = await client.getTransactionBlock({
          digest: tx.digest,
          options: {
            showEffects: true,
            showEvents: true,
            showInput: true
          }
        });

        stablecoinStats.analyzedTransactions++;
        stablecoinStats.recentTransactionDigests.push(tx.digest);

        // Check for coin transfer events
        if (txDetails.effects) {
          // Look for events in the transaction effects
          const events = (txDetails.effects as any).events || [];
          
          // Track transaction types for debugging
          const eventTypes = events.map((e: any) => e.type);
          stablecoinStats.transactionTypes.push(...eventTypes);
          
          for (const event of events) {
            if (event.type === 'coin::CoinTransferredEvent') {
              const coinType = event.parsedJson?.coin_type;
              const amount = event.parsedJson?.amount || 0;
              
              // Track all coin types we find
              stablecoinStats.allCoinTypes.add(coinType);
              
              // Add debug info for coin transfers
              stablecoinStats.debugInfo.push({
                type: 'coin_transfer',
                coinType,
                amount,
                digest: tx.digest
              });
              
              if (coinType === STABLECOIN_TYPES.USDC) {
                stablecoinStats.usdcTransactions++;
                stablecoinStats.usdcVolumeUSD += amount / Math.pow(10, 6); // USDC has 6 decimals
                stablecoinStats.totalVolumeUSD += amount / Math.pow(10, 6);
                stablecoinStats.totalTransactions++;
              } else if (coinType === STABLECOIN_TYPES.USDT) {
                stablecoinStats.usdtTransactions++;
                stablecoinStats.usdtVolumeUSD += amount / Math.pow(10, 6); // USDT has 6 decimals
                stablecoinStats.totalVolumeUSD += amount / Math.pow(10, 6);
                stablecoinStats.totalTransactions++;
              } else if (coinType === '0x2::sui::SUI') {
                // Track SUI transfers separately
                stablecoinStats.suiTransactions++;
                stablecoinStats.suiVolumeSUI += amount / Math.pow(10, 9); // SUI has 9 decimals
                stablecoinStats.totalVolumeSUI += amount / Math.pow(10, 9);
              }
            }
          }

                     // Also check for gas used in SUI terms
           if (txDetails.effects?.gasUsed?.computationCost) {
             const gasUsed = Number(txDetails.effects.gasUsed.computationCost) || 0;
             stablecoinStats.totalVolumeSUI += gasUsed / Math.pow(10, 9); // Convert from MIST to SUI
           }
        }
      } catch (error) {
        // Skip transactions that can't be processed
        console.error(`Failed to process transaction ${tx.digest}:`, error);
        continue;
      }
    }

    // Get network statistics for context
    try {
      const [latestCheckpoint, referenceGasPrice] = await Promise.all([
        client.getCheckpoint({ id: 'latest' }),
        client.getReferenceGasPrice()
      ]);

      stablecoinStats.networkContext = {
        currentEpoch: latestCheckpoint.epoch,
        currentCheckpoint: latestCheckpoint.sequenceNumber,
        gasPrice: referenceGasPrice,
        suiPriceUSD
      };

    } catch (error) {
      console.error('Failed to fetch network context:', error);
    }

    // Convert SUI volume to USD if we have the price
    if (suiPriceUSD > 0) {
      stablecoinStats.totalVolumeUSD += stablecoinStats.totalVolumeSUI * suiPriceUSD;
    }

    return NextResponse.json(stablecoinStats);
  } catch (error) {
    console.error('Error fetching stablecoin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stablecoin statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
} 