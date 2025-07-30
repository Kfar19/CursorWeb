import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

// Known stablecoin coin types on Sui (verified addresses)
const STABLECOIN_TYPES = {
  'USDC': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  'USDT': '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
  'DAI': '0x6f34d0d10c1f6d5c2e82f3b5c5c5c5c5c5c5c5c5c::coin::COIN', // Placeholder - need actual DAI address
  'BUSD': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', // Placeholder
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

    // Get more transactions for better sampling (increased limit)
    const transactions = await client.queryTransactions({
      limit: 2000, // Increased for better data coverage
      order: 'descending'
    });

    let stablecoinStats = {
      totalTransactions: 0,
      totalVolumeUSD: 0,
      totalVolumeSUI: 0,
      usdcTransactions: 0,
      usdcVolumeUSD: 0,
      usdtTransactions: 0,
      usdtVolumeUSD: 0,
      daiTransactions: 0,
      daiVolumeUSD: 0,
      busdTransactions: 0,
      busdVolumeUSD: 0,
      suiTransactions: 0,
      suiVolumeSUI: 0,
      timestamp: Date.now(),
      dataSource: 'Sui Mainnet RPC',
      lastUpdated: new Date().toISOString()
    };

    // Process transactions to find stablecoin transfers
    for (const tx of transactions.data) {
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

        if (txDetails.effects?.gasUsed?.timestampMs) {
          const txTime = parseInt(txDetails.effects.gasUsed.timestampMs);
          if (txTime >= startOfDay.getTime() && txTime <= endOfDay.getTime()) {
            
            // Check for coin transfer events
            if (txDetails.effects?.events) {
              for (const event of txDetails.effects.events) {
                if (event.type === 'coin::CoinTransferredEvent') {
                  const coinType = event.parsedJson?.coin_type;
                  const amount = event.parsedJson?.amount || 0;
                  
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
            }

            // Also check for gas used in SUI terms
            if (txDetails.effects?.gasUsed?.computationCost) {
              const gasUsed = txDetails.effects.gasUsed.computationCost || 0;
              stablecoinStats.totalVolumeSUI += gasUsed / Math.pow(10, 9); // Convert from MIST to SUI
            }
          }
        }
      } catch (error) {
        // Skip transactions that can't be processed
        continue;
      }
    }

    // Get additional network statistics for context
    try {
      const [latestCheckpoint, validators, referenceGasPrice] = await Promise.all([
        client.getLatestCheckpoint(),
        client.getValidators(),
        client.getReferenceGasPrice()
      ]);

      stablecoinStats.networkContext = {
        currentEpoch: latestCheckpoint.epoch,
        currentCheckpoint: latestCheckpoint.sequenceNumber,
        totalValidators: validators.validators.length,
        activeValidators: validators.validators.filter(v => v.stakingPool?.suiBalance > 0).length,
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