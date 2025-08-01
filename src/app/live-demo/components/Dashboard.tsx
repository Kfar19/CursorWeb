import React, { useState } from "react";
import { MintForm } from "./MintForm";
import { RedeemForm } from "./RedeemForm";
import { TxHistory } from "./TxHistory";
import { mockMint, mockRedeem, getTxHistory } from "../backend/mockApi";

export function Dashboard() {
  const [history, setHistory] = useState([]);
  const [reserveBalance, setReserveBalance] = useState(1000000); // Starting with $1M reserve

  const handleMint = async (amount: number) => {
    const res = await mockMint(amount);
    setReserveBalance(prev => prev + amount); // Increase reserve when minting
    setHistory(await getTxHistory());
  };

  const handleRedeem = async (amount: number) => {
    const res = await mockRedeem(amount);
    setReserveBalance(prev => prev - amount); // Decrease reserve when redeeming
    setHistory(await getTxHistory());
  };

  return (
    <div>
      {/* Reserve Balance Display */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Reserve Balance</h2>
        <div className="text-3xl font-bold text-blue-700">
          ${reserveBalance.toLocaleString()}
        </div>
        <p className="text-sm text-blue-600 mt-1">USD backing stablecoin supply</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MintForm onMint={handleMint} />
        <RedeemForm onRedeem={handleRedeem} />
      </div>
      <TxHistory history={history} />
    </div>
  );
} 