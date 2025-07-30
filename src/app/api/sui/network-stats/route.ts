import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

export async function GET() {
  try {
    // Get latest checkpoint for network stats
    const latestCheckpoint = await client.getLatestCheckpoint();
    
    // Get validators info
    const validators = await client.getValidators();
    
    // Get reference gas price
    const referenceGasPrice = await client.getReferenceGasPrice();
    
    // Get total supply
    const totalSupply = await client.getTotalSupply({ coinType: '0x2::sui::SUI' });
    
    // Calculate TPS (simplified - you might want to get more checkpoints for accurate TPS)
    const currentEpoch = latestCheckpoint.epoch;
    const currentCheckpoint = latestCheckpoint.sequenceNumber;
    
    // Get checkpoint from 1 hour ago for TPS calculation
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    let tps = 0;
    
    try {
      // This is a simplified TPS calculation
      // In production, you'd want to get multiple checkpoints over time
      const checkpoints = await client.getCheckpoints({
        limit: 10,
        descendingOrder: true
      });
      
      if (checkpoints.data.length > 1) {
        const recentCheckpoint = checkpoints.data[0];
        const olderCheckpoint = checkpoints.data[checkpoints.data.length - 1];
        
        const timeDiff = (recentCheckpoint.timestampMs || 0) - (olderCheckpoint.timestampMs || 0);
        const txDiff = (recentCheckpoint.transactions || 0) - (olderCheckpoint.transactions || 0);
        
        if (timeDiff > 0) {
          tps = Math.round((txDiff / timeDiff) * 1000);
        }
      }
    } catch (error) {
      console.log('TPS calculation error:', error);
      tps = 0;
    }

    const networkStats = {
      tps: tps,
      totalValidators: validators.validators.length,
      activeValidators: validators.validators.filter(v => v.stakingPool?.suiBalance > 0).length,
      referenceGasPrice: referenceGasPrice,
      totalSupply: totalSupply.value,
      circulatingSupply: totalSupply.value, // Simplified - you might want to calculate this differently
      currentEpoch: currentEpoch,
      currentCheckpoint: currentCheckpoint,
      timestamp: Date.now()
    };

    return NextResponse.json(networkStats);
  } catch (error) {
    console.error('Error fetching Sui network stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network stats' },
      { status: 500 }
    );
  }
} 