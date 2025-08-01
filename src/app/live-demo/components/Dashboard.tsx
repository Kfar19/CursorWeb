import React, { useState } from "react";
import { MintForm } from "./MintForm";
import { RedeemForm } from "./RedeemForm";
import { TxHistory } from "./TxHistory";
import { mockMint, mockRedeem, getTxHistory } from "../backend/mockApi";

export function Dashboard() {
  const [history, setHistory] = useState([]);

  const handleMint = async (amount: number) => {
    const res = await mockMint(amount);
    setHistory(await getTxHistory());
  };

  const handleRedeem = async (amount: number) => {
    const res = await mockRedeem(amount);
    setHistory(await getTxHistory());
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <MintForm onMint={handleMint} />
        <RedeemForm onRedeem={handleRedeem} />
      </div>
      <TxHistory history={history} />
    </div>
  );
} 