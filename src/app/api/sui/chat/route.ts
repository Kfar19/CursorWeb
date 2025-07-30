import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // Get current blockchain data for context
    const [latestCheckpoint, validators, referenceGasPrice, totalSupply] = await Promise.all([
      client.getLatestCheckpoint(),
      client.getValidators(),
      client.getReferenceGasPrice(),
      client.getTotalSupply({ coinType: '0x2::sui::SUI' })
    ]);

    // Get recent transactions for context
    const recentTransactions = await client.queryTransactions({
      limit: 10,
      order: 'descending'
    });

    // Get stablecoin statistics if the question is about stablecoins
    let stablecoinStats = null;
    if (message.toLowerCase().includes('stablecoin') || 
        message.toLowerCase().includes('usdc') || 
        message.toLowerCase().includes('usdt') || 
        message.toLowerCase().includes('dai') ||
        message.toLowerCase().includes('busd')) {
      try {
        const stablecoinResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sui/stablecoin-stats`);
        if (stablecoinResponse.ok) {
          stablecoinStats = await stablecoinResponse.json();
        }
      } catch (error) {
        console.error('Failed to fetch stablecoin stats:', error);
      }
    }

    // Create context for the AI
    const blockchainContext = {
      currentEpoch: latestCheckpoint.epoch,
      currentCheckpoint: latestCheckpoint.sequenceNumber,
      totalValidators: validators.validators.length,
      activeValidators: validators.validators.filter(v => v.stakingPool?.suiBalance > 0).length,
      gasPrice: referenceGasPrice,
      totalSupply: totalSupply.value,
      recentTransactionCount: recentTransactions.data.length,
      averageGasUsed: recentTransactions.data.reduce((acc, tx) => acc + (tx.effects?.gasUsed?.computationCost || 0), 0) / recentTransactions.data.length,
      timestamp: Date.now(),
      stablecoinStats
    };

    // Simple AI response logic based on keywords
    const response = generateAIResponse(message.toLowerCase(), blockchainContext);

    return NextResponse.json({
      response,
      context: blockchainContext,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function generateAIResponse(message: string, context: any): string {
  // Network performance questions
  if (message.includes('tps') || message.includes('transactions per second') || message.includes('throughput')) {
    return `The current network throughput is calculated from recent checkpoints. Sui's high-performance architecture allows for parallel transaction processing, which can achieve thousands of transactions per second under optimal conditions. The actual TPS varies based on network activity and transaction complexity.`;
  }

  if (message.includes('gas') || message.includes('gas price') || message.includes('fees')) {
    return `The current reference gas price is ${context.gasPrice} MIST. Gas prices on Sui are typically much lower than other blockchains due to its efficient consensus mechanism. Gas fees are used to compensate validators for processing transactions and maintaining network security.`;
  }

  if (message.includes('validator') || message.includes('validators')) {
    return `Sui currently has ${context.totalValidators} total validators, with ${context.activeValidators} actively participating in consensus. Validators are responsible for processing transactions, maintaining network security, and earning rewards through staking. The validator set is dynamic and can change based on staking amounts and performance.`;
  }

  if (message.includes('epoch') || message.includes('checkpoint')) {
    return `The network is currently at epoch ${context.currentEpoch} and checkpoint ${context.currentCheckpoint}. Sui uses a unique consensus mechanism where epochs represent periods of validator participation, and checkpoints are created every few seconds to finalize transaction batches.`;
  }

  if (message.includes('supply') || message.includes('circulating') || message.includes('total supply')) {
    const supplyInSUI = context.totalSupply / Math.pow(10, 9);
    return `The total supply of SUI is approximately ${supplyInSUI.toLocaleString()} tokens. SUI has a fixed supply, meaning no new tokens are minted. The circulating supply represents tokens available for trading and staking.`;
  }

  if (message.includes('transaction') || message.includes('tx') || message.includes('recent')) {
    return `I can see ${context.recentTransactionCount} recent transactions in the network. The average gas used per transaction is approximately ${Math.round(context.averageGasUsed)} MIST. Sui supports various transaction types including transfers, smart contract calls, and NFT operations.`;
  }

  if (message.includes('performance') || message.includes('speed') || message.includes('fast')) {
    return `Sui is designed for high performance with sub-second finality. Its unique consensus mechanism allows for parallel processing of independent transactions, which significantly improves throughput compared to traditional blockchains. The network can handle thousands of transactions per second.`;
  }

  if (message.includes('security') || message.includes('safe') || message.includes('secure')) {
    return `Sui uses a Byzantine Fault Tolerant (BFT) consensus mechanism that ensures network security even if up to one-third of validators are malicious. The network is secured by a distributed validator set, and all transactions are cryptographically verified before finalization.`;
  }

  if (message.includes('stake') || message.includes('staking') || message.includes('rewards')) {
    return `SUI holders can stake their tokens with validators to earn rewards. Staking helps secure the network and provides passive income. Rewards are distributed based on validator performance and the amount staked. The current validator set shows active participation in the staking ecosystem.`;
  }

  if (message.includes('nft') || message.includes('token') || message.includes('asset')) {
    return `Sui supports native NFTs and custom tokens through its object model. Unlike other blockchains, Sui's object model allows for more flexible asset representation and better performance. NFTs and tokens can be transferred, traded, and used in smart contracts.`;
  }

  if (message.includes('smart contract') || message.includes('dapp') || message.includes('decentralized')) {
    return `Sui supports smart contracts written in Move, a safe and secure programming language. The platform enables developers to build decentralized applications (dApps) with high performance and low gas costs. The network's parallel processing capabilities make it ideal for DeFi and gaming applications.`;
  }

  if (message.includes('price') || message.includes('market') || message.includes('value')) {
    return `I can see live market data in the dashboard, including current price, market cap, and 24-hour volume. SUI's price is determined by market forces and can be influenced by network adoption, developer activity, and overall market conditions. The dashboard shows real-time price updates.`;
  }

  // Stablecoin-specific responses
  if (message.includes('stablecoin') || message.includes('usdc') || message.includes('usdt') || message.includes('dai') || message.includes('busd')) {
    if (context.stablecoinStats) {
      const stats = context.stablecoinStats;
      const totalVolumeFormatted = stats.totalVolumeUSD.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      const suiVolumeFormatted = stats.totalVolumeSUI.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      if (message.includes('today') || message.includes('daily') || message.includes('24 hour')) {
        return `Today's stablecoin activity on Sui: ${stats.totalTransactions} total stablecoin transactions with ${totalVolumeFormatted} in volume. In SUI terms, that's approximately ${suiVolumeFormatted} SUI. USDC leads with ${stats.usdcTransactions} transactions (${stats.usdcVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}), followed by USDT with ${stats.usdtTransactions} transactions (${stats.usdtVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}).`;
      }

      if (message.includes('volume') || message.includes('amount') || message.includes('dollar')) {
        return `Current stablecoin volume on Sui: ${totalVolumeFormatted} in USD and ${suiVolumeFormatted} SUI. USDC volume: ${stats.usdcVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${stats.usdcTransactions} transactions), USDT volume: ${stats.usdtVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${stats.usdtTransactions} transactions).`;
      }

      if (message.includes('transaction') || message.includes('count') || message.includes('number')) {
        return `Stablecoin transaction count on Sui today: ${stats.totalTransactions} total transactions. Breakdown: ${stats.usdcTransactions} USDC transactions, ${stats.usdtTransactions} USDT transactions. This represents significant DeFi activity on the network.`;
      }

      return `Sui stablecoin activity: ${stats.totalTransactions} transactions today with ${totalVolumeFormatted} in volume. USDC is the most active with ${stats.usdcTransactions} transactions, followed by USDT with ${stats.usdtTransactions} transactions. The network supports major stablecoins for DeFi applications.`;
    } else {
      return `I can see stablecoin activity on Sui, but I'm having trouble fetching the specific data right now. Sui supports major stablecoins like USDC and USDT, which are widely used for DeFi applications, trading, and cross-border payments on the network.`;
    }
  }

  // Default response
  return `I can help you understand the Sui blockchain data! You can ask me about network performance, gas prices, validators, transactions, supply, security, staking, NFTs, smart contracts, market data, or stablecoin activity. What specific aspect of the Sui network would you like to know more about?`;
} 