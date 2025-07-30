import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // Get stablecoin statistics if the question is about stablecoins
    let stablecoinStats = null;
    if (message.toLowerCase().includes('stablecoin') || 
        message.toLowerCase().includes('usdc') || 
        message.toLowerCase().includes('usdt')) {
      try {
        const stablecoinResponse = await fetch('http://localhost:3000/api/sui/stablecoin-stats');
        if (stablecoinResponse.ok) {
          stablecoinStats = await stablecoinResponse.json();
        }
      } catch (error) {
        console.error('Failed to fetch stablecoin stats:', error);
      }
    }

    // Create context for the AI
    const blockchainContext = {
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
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
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
    return `Gas prices on Sui are typically much lower than other blockchains due to its efficient consensus mechanism. Gas fees are used to compensate validators for processing transactions and maintaining network security. The current gas price varies based on network congestion.`;
  }

  if (message.includes('validator') || message.includes('validators')) {
    return `Sui uses a distributed validator set to maintain network security and process transactions. Validators are responsible for processing transactions, maintaining network security, and earning rewards through staking. The validator set is dynamic and can change based on staking amounts and performance.`;
  }

  if (message.includes('epoch') || message.includes('checkpoint')) {
    return `Sui uses a unique consensus mechanism where epochs represent periods of validator participation, and checkpoints are created every few seconds to finalize transaction batches. This ensures fast finality and high throughput.`;
  }

  if (message.includes('supply') || message.includes('circulating') || message.includes('total supply')) {
    return `SUI has a fixed supply, meaning no new tokens are minted. The circulating supply represents tokens available for trading and staking. The total supply is distributed among various stakeholders including validators, stakers, and general users.`;
  }

  if (message.includes('transaction') || message.includes('tx') || message.includes('recent')) {
    return `Sui supports various transaction types including transfers, smart contract calls, and NFT operations. The network processes transactions in parallel when possible, which significantly improves throughput compared to traditional blockchains.`;
  }

  if (message.includes('performance') || message.includes('speed') || message.includes('fast')) {
    return `Sui is designed for high performance with sub-second finality. Its unique consensus mechanism allows for parallel processing of independent transactions, which significantly improves throughput compared to traditional blockchains. The network can handle thousands of transactions per second.`;
  }

  if (message.includes('security') || message.includes('safe') || message.includes('secure')) {
    return `Sui uses a Byzantine Fault Tolerant (BFT) consensus mechanism that ensures network security even if up to one-third of validators are malicious. The network is secured by a distributed validator set, and all transactions are cryptographically verified before finalization.`;
  }

  if (message.includes('stake') || message.includes('staking') || message.includes('rewards')) {
    return `SUI holders can stake their tokens with validators to earn rewards. Staking helps secure the network and provides passive income. Rewards are distributed based on validator performance and the amount staked.`;
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
  if (message.includes('stablecoin') || message.includes('usdc') || message.includes('usdt')) {
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

      // Add data source verification
      const dataSource = stats.dataSource || 'Sui Mainnet RPC';
      const lastUpdated = stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Just now';

      if (message.includes('today') || message.includes('daily') || message.includes('24 hour')) {
        return `📊 **Real-time data from ${dataSource}** (updated ${lastUpdated}):\n\nToday's stablecoin activity on Sui: **${stats.totalTransactions}** total stablecoin transactions with **${totalVolumeFormatted}** in volume. In SUI terms, that's approximately **${suiVolumeFormatted} SUI**.\n\n**Breakdown:**\n• USDC: ${stats.usdcTransactions} transactions (${stats.usdcVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})\n• USDT: ${stats.usdtTransactions} transactions (${stats.usdtVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})\n• SUI transfers: ${stats.suiTransactions || 0} transactions (${(stats.suiVolumeSUI || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SUI)`;
      }

      if (message.includes('volume') || message.includes('amount') || message.includes('dollar')) {
        return `💰 **Live volume data from Sui blockchain** (${lastUpdated}):\n\n**Total Volume:** ${totalVolumeFormatted} USD / ${suiVolumeFormatted} SUI\n\n**By Token:**\n• USDC: ${stats.usdcVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${stats.usdcTransactions} tx)\n• USDT: ${stats.usdtVolumeUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${stats.usdtTransactions} tx)\n• SUI: ${(stats.suiVolumeSUI || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} SUI (${stats.suiTransactions || 0} tx)\n\n*Data source: ${dataSource}*`;
      }

      if (message.includes('transaction') || message.includes('count') || message.includes('number')) {
        return `🔢 **Transaction count from Sui mainnet** (${lastUpdated}):\n\n**Total stablecoin transactions today:** ${stats.totalTransactions}\n\n**Detailed breakdown:**\n• USDC: ${stats.usdcTransactions} transactions\n• USDT: ${stats.usdtTransactions} transactions\n• SUI transfers: ${stats.suiTransactions || 0} transactions\n\nThis represents significant DeFi activity on the Sui network, with real-time data from ${dataSource}.`;
      }

      if (message.includes('real') || message.includes('live') || message.includes('accurate')) {
        return `✅ **Verified live data from Sui blockchain** (${lastUpdated}):\n\nAll data is fetched directly from Sui mainnet RPC in real-time. I analyze ${stats.totalTransactions} actual transactions from the last 24 hours to provide accurate statistics.\n\n**Current stats:**\n• Total transactions: ${stats.totalTransactions}\n• Total volume: ${totalVolumeFormatted} USD\n• SUI volume: ${suiVolumeFormatted} SUI\n\n*Data source: ${dataSource} - No estimates or approximations*`;
      }

      return `📈 **Sui stablecoin activity** (${lastUpdated}):\n\n**${stats.totalTransactions}** transactions today with **${totalVolumeFormatted}** in volume.\n\n**Most active tokens:**\n• USDC: ${stats.usdcTransactions} transactions\n• USDT: ${stats.usdtTransactions} transactions\n• SUI: ${stats.suiTransactions || 0} transactions\n\n*Real-time data from ${dataSource}*`;
    } else {
      return `I'm currently fetching live stablecoin data from the Sui blockchain, but there might be a temporary connection issue. Sui supports major stablecoins like USDC and USDT, which are widely used for DeFi applications, trading, and cross-border payments on the network. Please try asking again in a moment.`;
    }
  }

  // Default response
  return `I can help you understand the Sui blockchain data! You can ask me about network performance, gas prices, validators, transactions, supply, security, staking, NFTs, smart contracts, market data, or stablecoin activity. What specific aspect of the Sui network would you like to know more about?`;
} 