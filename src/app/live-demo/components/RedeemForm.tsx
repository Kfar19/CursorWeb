import React, { useState } from "react";

export function RedeemForm({ onRedeem }: { onRedeem: (amount: number) => void }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">Redeem Stablecoin</h2>
      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => {
          onRedeem(Number(amount));
          setAmount("");
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Redeem
      </button>
    </div>
  );
} 