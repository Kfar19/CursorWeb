import React, { useState } from "react";

export function MintForm({ onMint }: { onMint: (amount: number) => void }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">Mint Stablecoin</h2>
      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => {
          onMint(Number(amount));
          setAmount("");
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Mint
      </button>
    </div>
  );
} 