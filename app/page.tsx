"use client";

import { useState } from "react";

export default function Home() {
  const [btcHoldings, setBtcHoldings] = useState(0.05);
  const [monthlyUsd, setMonthlyUsd] = useState(300);
  const btcPrice = 60000;

  const remainingBtc = 1 - btcHoldings;
  const btcPerMonth = monthlyUsd / btcPrice;
  const monthsToGoal =
    btcPerMonth > 0 ? Math.ceil(remainingBtc / btcPerMonth) : 0;

  const progress = Math.min((btcHoldings / 1) * 100, 100);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Road to 1 BTC
        </h1>

        <div className="space-y-4">
          <div>
            <label>Current BTC Holdings</label>
            <input
              type="number"
              step="0.0001"
              value={btcHoldings}
              onChange={(e) => setBtcHoldings(Number(e.target.value))}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label>Monthly Investment (USD)</label>
            <input
              type="number"
              value={monthlyUsd}
              onChange={(e) => setMonthlyUsd(Number(e.target.value))}
              className="w-full p-2 rounded text-black"
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <p>Estimated Months to Reach 1 BTC:</p>
          <p className="text-2xl font-bold">{monthsToGoal} months</p>
        </div>

        <div>
          <div className="w-full bg-gray-700 rounded h-4">
            <div
              className="bg-orange-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2">{progress.toFixed(2)}% Complete</p>
        </div>
      </div>
    </main>
  );
}
