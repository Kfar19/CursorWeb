let txHistory: any[] = [];

export async function mockMint(amount: number) {
  const tx = {
    type: "Mint",
    amount,
    status: "Success",
    txHash: "0x" + Math.random().toString(16).substr(2, 8),
  };
  txHistory.unshift(tx);
  return tx;
}

export async function mockRedeem(amount: number) {
  const tx = {
    type: "Redeem",
    amount,
    status: "Success",
    txHash: "0x" + Math.random().toString(16).substr(2, 8),
  };
  txHistory.unshift(tx);
  return tx;
}

export async function getTxHistory() {
  return txHistory.slice(0, 10);
} 