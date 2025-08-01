import React from "react";

export function TxHistory({ history }: { history: any[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Transaction History</h2>
      <table className="w-full text-sm border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {history.map((tx, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{tx.type}</td>
              <td className="p-2">${tx.amount}</td>
              <td className="p-2">{tx.status}</td>
              <td className="p-2 text-xs">{tx.txHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 