"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [btcHoldings, setBtcHoldings] = useState(0.05);
  const [monthlyUsd, setMonthlyUsd] = useState(300);
  const [btcPrice, setBtcPrice] = useState(60000);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch BTC price from our API
  const loadPrice = async () => {
    try {
      setLoadingPrice(true);
      const res = await fetch("/api/btc-price", { cache: "no-store" });
      const data = await res.json();
      if (typeof data.price === "number") {
        setBtcPrice(data.price);
      }
    } catch (err) {
      console.error("Failed to fetch BTC price");
    } finally {
      setLoadingPrice(false);
    }
  };

  // Load on first render + auto refresh every 60 seconds
  useEffect(() => {
    loadPrice();
    const interval = setInterval(loadPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const remainingBtc = Math.max(1 - btcHoldings, 0);
  const btcPerMonth = btcPrice > 0 ? monthlyUsd / btcPrice : 0;

  const monthsToGoal =
    btcPerMonth > 0 ? Math.ceil(remainingBtc / btcPerMonth) : 0;

  const progressPct = Math.min((btcHoldings / 1) * 100, 100);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Road to 1 BTC
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current BTC Holdings</label>
            <input
              type="number"
              step="0.0001"
              value={btcHoldings}
              onChange={(e) => setBtcHoldings(Number(e.target.value))}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Monthly Investment (USD)</label>
            <input
              type="number"
              value={monthlyUsd}
              onChange={(e) => setMonthlyUsd(Number(e.target.value))}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              BTC Price (Live)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={btcPrice}
                readOnly
                className="w-full p-2 rounded text-black bg-gray-200"
              />
              <button
                onClick={loadPrice}
                className="px-3 py-2 bg-orange-500 rounded hover:bg-orange-600"
              >
                {loadingPrice ? "..." : "↻"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded p-4 border border-gray-800">
          <p className="text-gray-300">
            Estimated Months to Reach 1 BTC:
          </p>
          <p className="text-2xl font-bold mt-1">
            {monthsToGoal > 0 ? `${monthsToGoal} months` : "--"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Projection assumes BTC price and monthly investment remain constant.
          </p>
        </div>

        <div>
          <div className="w-full bg-gray-800 rounded h-4 overflow-hidden">
            <div
              className="bg-orange-500 h-4"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-300">
            {progressPct.toFixed(2)}% Complete
          </p>
        </div>
      </div>
    </main>
  );
}
