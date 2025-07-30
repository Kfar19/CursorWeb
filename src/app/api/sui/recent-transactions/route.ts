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

          return {
            digest: tx.digest,
            timestamp: txDetails.effects?.gasUsed?.timestampMs || Date.now(),
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
  
  // Check for coin transfer
  if (txDetails.objectChanges?.some((change: any) => change.type === 'transferred')) {
    return 'Transfer';
  }
  
  // Check for NFT transfer
  if (txDetails.objectChanges?.some((change: any) => change.objectType?.includes('nft'))) {
    return 'NFT';
  }
  
  // Check for smart contract call
  if (txDetails.transaction?.data?.transactions?.some((t: any) => t.MoveCall)) {
    return 'Smart Contract';
  }
  
  // Check for system transactions (gas payments, etc.)
  if (txDetails.transaction?.data?.transactions?.some((t: any) => t.PaySui || t.Pay)) {
    return 'Payment';
  }
  
  // Check for object operations
  if (txDetails.objectChanges?.some((change: any) => change.type === 'created' || change.type === 'mutated')) {
    return 'Object Operation';
  }
  
  return 'System';
}

function getTransactionAmount(txDetails: any): number {
  if (!txDetails?.objectChanges) return 0;
  
  const coinChanges = txDetails.objectChanges.filter((change: any) => 
    change.type === 'transferred' && change.objectType?.includes('coin')
  );
  
  if (coinChanges.length > 0) {
    return parseFloat(coinChanges[0].amount || 0) / Math.pow(10, 9); // Convert from MIST to SUI
  }
  
  return 0;
}

function getTransactionRecipient(txDetails: any): string {
  if (!txDetails?.objectChanges) return 'Unknown';
  
  const transfer = txDetails.objectChanges.find((change: any) => change.type === 'transferred');
  
  if (transfer) {
    return transfer.recipient?.AddressOwner || 'Unknown';
  }
  
  return 'Unknown';
} 