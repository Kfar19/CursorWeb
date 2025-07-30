import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

export async function GET() {
  try {
    // Get recent transactions
    const recentTransactions = await client.queryTransactionBlocks({
      limit: 20,
      order: 'descending'
    });

    // Process transactions to get more details
    const processedTransactions = await Promise.all(
      recentTransactions.data.map(async (tx) => {
        try {
          const txDetails = await client.getTransactionBlock({
            digest: tx.digest,
            options: {
              showInput: true,
              showEffects: true,
              showEvents: true,
              showObjectChanges: true
            }
          });

          // Get timestamp from various possible sources
          let timestamp = Date.now();
          if (txDetails.effects?.gasUsed?.timestampMs) {
            timestamp = parseInt(txDetails.effects.gasUsed.timestampMs);
          } else if (txDetails.effects?.gasUsed?.timestamp) {
            timestamp = parseInt(txDetails.effects.gasUsed.timestamp);
          } else if (txDetails.effects?.createdAt) {
            timestamp = parseInt(txDetails.effects.createdAt);
          }

          return {
            digest: tx.digest,
            timestamp: timestamp,
            status: txDetails.effects?.status?.status || 'Success',
            gasUsed: txDetails.effects?.gasUsed?.computationCost || 0,
            gasPrice: txDetails.effects?.gasUsed?.gasPrice || 0,
            sender: txDetails.transaction?.data?.sender || 'Unknown',
            type: getTransactionType(txDetails),
            amount: getTransactionAmount(txDetails),
            recipient: getTransactionRecipient(txDetails)
          };
        } catch (error) {
          console.log('Error processing transaction:', error);
          return {
            digest: tx.digest,
            timestamp: Date.now(),
            status: 'Error',
            gasUsed: 0,
            gasPrice: 0,
            sender: 'Unknown',
            type: 'Unknown',
            amount: 0,
            recipient: 'Unknown'
          };
        }
      })
    );

    return NextResponse.json({
      transactions: processedTransactions,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

function getTransactionType(txDetails: any): string {
  if (!txDetails) return 'Unknown';
  
  const transactions = txDetails.transaction?.data?.transactions || [];
  const objectChanges = txDetails.objectChanges || [];
  
  // Check for specific transaction types first
  for (const tx of transactions) {
    // PaySui transaction
    if (tx.PaySui) {
      return 'SUI Payment';
    }
    
    // Pay transaction (for other coins)
    if (tx.Pay) {
      return 'Coin Payment';
    }
    
    // MoveCall (smart contract)
    if (tx.MoveCall) {
      const module = tx.MoveCall.module;
      const funcName = tx.MoveCall.function;
      
      // DeFi operations
      if (module?.includes('swap') || funcName?.includes('swap')) {
        return 'DeFi Swap';
      }
      if (module?.includes('liquidity') || funcName?.includes('liquidity')) {
        return 'DeFi Liquidity';
      }
      if (module?.includes('stake') || funcName?.includes('stake')) {
        return 'Staking';
      }
      if (module?.includes('nft') || funcName?.includes('nft')) {
        return 'NFT Operation';
      }
      if (module?.includes('marketplace') || funcName?.includes('marketplace')) {
        return 'NFT Marketplace';
      }
      
      return 'Smart Contract';
    }
    
    // TransferSui
    if (tx.TransferSui) {
      return 'SUI Transfer';
    }
    
    // TransferObject
    if (tx.TransferObject) {
      return 'Object Transfer';
    }
  }
  
  // Check object changes for more specific types
  for (const change of objectChanges) {
    // Coin transfers
    if (change.type === 'transferred' && change.objectType?.includes('coin')) {
      if (change.objectType?.includes('sui::sui::SUI')) {
        return 'SUI Transfer';
      } else if (change.objectType?.includes('usdc')) {
        return 'USDC Transfer';
      } else if (change.objectType?.includes('usdt')) {
        return 'USDT Transfer';
      } else {
        return 'Coin Transfer';
      }
    }
    
    // NFT transfers
    if (change.type === 'transferred' && change.objectType?.includes('nft')) {
      return 'NFT Transfer';
    }
    
    // Object creation
    if (change.type === 'created') {
      if (change.objectType?.includes('nft')) {
        return 'NFT Mint';
      } else if (change.objectType?.includes('coin')) {
        return 'Coin Mint';
      } else {
        return 'Object Creation';
      }
    }
    
    // Object mutation
    if (change.type === 'mutated') {
      return 'Object Update';
    }
  }
  
  // Check for gas payments (system transactions)
  if (transactions.length === 0 && objectChanges.length === 0) {
    return 'Gas Payment';
  }
  
  return 'System';
}

function getTransactionAmount(txDetails: any): number {
  if (!txDetails?.objectChanges) return 0;
  
  // Look for coin transfers
  const coinChanges = txDetails.objectChanges.filter((change: any) => 
    change.type === 'transferred' && change.objectType?.includes('coin')
  );
  
  if (coinChanges.length > 0) {
    const amount = parseFloat(coinChanges[0].amount || 0);
    // Handle different decimal places for different coins
    if (coinChanges[0].objectType?.includes('sui::sui::SUI')) {
      return amount / Math.pow(10, 9); // SUI has 9 decimals
    } else if (coinChanges[0].objectType?.includes('usdc') || coinChanges[0].objectType?.includes('usdt')) {
      return amount / Math.pow(10, 6); // USDC/USDT have 6 decimals
    } else {
      return amount / Math.pow(10, 9); // Default to 9 decimals
    }
  }
  
  // Also check for gas costs as a fallback
  if (txDetails.effects?.gasUsed?.computationCost) {
    return parseFloat(txDetails.effects.gasUsed.computationCost) / Math.pow(10, 9);
  }
  
  return 0;
}

function getTransactionRecipient(txDetails: any): string {
  if (!txDetails?.objectChanges) return 'Unknown';
  
  // Look for transfers
  const transfer = txDetails.objectChanges.find((change: any) => change.type === 'transferred');
  
  if (transfer) {
    if (transfer.recipient?.AddressOwner) {
      return transfer.recipient.AddressOwner;
    } else if (transfer.recipient?.ObjectOwner) {
      return transfer.recipient.ObjectOwner;
    }
  }
  
  // Check for PaySui transactions
  if (txDetails.transaction?.data?.transactions) {
    for (const tx of txDetails.transaction.data.transactions) {
      if (tx.PaySui && tx.recipients && tx.recipients.length > 0) {
        return tx.recipients[0];
      } else if (tx.Pay && tx.recipients && tx.recipients.length > 0) {
        return tx.recipients[0];
      }
    }
  }
  
  return 'System';
} 