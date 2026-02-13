"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [btcHoldings, setBtcHoldings] = useState<number>(0.05);
  const [monthlyUsd, setMonthlyUsd] = useState<number>(300);
  const [btcPrice, setBtcPrice] = useState<number>(60000);

  const { monthsToGoal, progressPct } = useMemo(() => {
    const holdings = Number.isFinite(btcHoldings) ? btcHoldings : 0;
    const monthly = Number.isFinite(monthlyUsd) ? monthlyUsd : 0;
    const price = Number.isFinite(btcPrice) && btcPrice > 0 ? btcPrice : 0;

    const clampedHoldings = Math.max(0, Math.min(holdings, 1));
    const remainingBtc = Math.max(0, 1 - clampedHoldings);
    const btcPerMonth = price > 0 ? monthly / price : 0;

    const months =
      btcPerMonth > 0 ? Math.ceil(remainingBtc / btcPerMonth) : 0;

    const progress = Math.min((clampedHoldings / 1) * 100, 100);

    return { monthsToGoal: months, progressPct: progress };
  }, [btcHoldings, monthlyUsd, btcPrice]);

  const inputClass =
    "w-full p-3 rounded bg-white text-black border border-gray-300 outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Road to 1 BTC</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-200">
              Current BTC Holdings
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.0001"
              min="0"
              value={btcHoldings}
              onChange={(e) => setBtcHoldings(Number(e.target.value))}
              className={inputClass}
              placeholder="0.05"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-200">
              Monthly Investment (USD)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="1"
              min="0"
              value={monthlyUsd}
              onChange={(e) => setMonthlyUsd(Number(e.target.value))}
              className={inputClass}
              placeholder="300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-200">
              BTC Price (USD)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="1"
              min="1"
              value={btcPrice}
              onChange={(e) => setBtcPrice(Number(e.target.value))}
              className={inputClass}
              placeholder="60000"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded p-4 border border-gray-800">
          <p className="text-gray-200">Estimated Months to Reach 1 BTC:</p>
          <p className="text-2xl font-bold mt-1">
            {monthsToGoal > 0 ? `${monthsToGoal} months` : "—"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            (Assumes your monthly investment and BTC price stay constant.)
          </p>
        </div>

        <div>
          <div className="w-full bg-gray-800 rounded h-4 overflow-hidden">
            <div
              className="bg-orange-500 h-4"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-200">
            {progressPct.toFixed(2)}% Complete
          </p>
        </div>
      </div>
    </main>
  );
}

