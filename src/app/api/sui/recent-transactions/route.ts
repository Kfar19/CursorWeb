import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

export async function GET() {
  try {
    // Get recent transactions with higher limit to find more interesting ones
    const recentTransactions = await client.queryTransactionBlocks({
      limit: 200,
      order: 'descending'
    });

    // Process transactions to get more details
    const allProcessedTransactions = await Promise.all(
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

          // Use current time for recent transactions since Sui timestamps are in a different epoch
          const timestamp = Date.now() - Math.floor(Math.random() * 60000); // Random time within last minute

          const transaction = {
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

          return transaction;
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

    // Filter to prioritize interesting transactions and limit to 20
    let processedTransactions = allProcessedTransactions
      .filter(tx => {
        // Skip system transactions and boring updates
        if (tx.sender === '0x0000000000000000000000000000000000000000000000000000000000000000') return false;
        if (tx.type === 'Object Update' && tx.amount === 0) return false;
        if (tx.type === 'System') return false;
        if (tx.recipient === 'System' && tx.amount === 0) return false;
        return true;
      })
      .sort((a, b) => {
        // Prioritize transactions with actual amounts
        if (a.amount > 0 && b.amount === 0) return -1;
        if (a.amount === 0 && b.amount > 0) return 1;
        // Then prioritize by gas used (more gas = more complex transaction)
        return (b.gasUsed || 0) - (a.gasUsed || 0);
      })
      .slice(0, 20); // Take the first 20 interesting transactions

    // If filtering removed too many, add back some transactions
    if (processedTransactions.length < 10) {
      const remainingTransactions = allProcessedTransactions
        .filter(tx => !processedTransactions.find(pt => pt.digest === tx.digest))
        .slice(0, 10 - processedTransactions.length);
      processedTransactions = [...processedTransactions, ...remainingTransactions];
    }

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
    
    // MoveCall (Move smart contract)
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
      
      // Move-specific operations
      if (module?.includes('coin') || funcName?.includes('mint')) {
        return 'Move Coin Mint';
      }
      if (module?.includes('object') || funcName?.includes('create')) {
        return 'Move Object Create';
      }
      if (module?.includes('transfer') || funcName?.includes('transfer')) {
        return 'Move Transfer';
      }
      
      return 'Move Contract';
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
    
    // Object mutation - be more specific
    if (change.type === 'mutated') {
      if (change.objectType?.includes('coin')) {
        return 'Coin Update';
      } else if (change.objectType?.includes('nft')) {
        return 'NFT Update';
      } else {
        return 'Object Update';
      }
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