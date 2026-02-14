"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [currentBtc, setCurrentBtc] = useState(0.05);
  const [monthlyInvestment, setMonthlyInvestment] = useState(300);
  const [btcPrice, setBtcPrice] = useState(60000);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const targetBtc = 1;

  // Fetch live BTC price from your API route
  const fetchBtcPrice = async () => {
    try {
      setLoadingPrice(true);
      const res = await fetch("/api/btc-price");
      const data = await res.json();
      if (data.price) {
        setBtcPrice(data.price);
      }
    } catch (error) {
      console.error("Failed to fetch BTC price");
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    fetchBtcPrice();
  }, []);

  const btcRemaining = targetBtc - currentBtc;

  let monthsToGoal = 0;

  if (monthlyInvestment > 0 && btcPrice > 0 && btcRemaining > 0) {
    const btcPerMonth = monthlyInvestment / btcPrice;
    monthsToGoal = Math.ceil(btcRemaining / btcPerMonth);
  }

  const progressPct =
    currentBtc >= targetBtc
      ? 100
      : Math.min((currentBtc / targetBtc) * 100, 100);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-8">

        <h1 className="text-4xl font-bold text-center">
          Road to 1 BTC
        </h1>

        {/* Current Holdings */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            Current BTC Holdings
          </label>
          <input
            type="number"
            step="0.0001"
            value={currentBtc}
            onChange={(e) => setCurrentBtc(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-white text-black placeholder-gray-500 border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Monthly Investment */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            Monthly Investment (USD)
          </label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) =>
              setMonthlyInvestment(parseFloat(e.target.value) || 0)
            }
            className="w-full rounded-lg bg-white text-black placeholder-gray-500 border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* BTC Price */}
        <div className="space-y-2">
          <label className="block text-gray-300">
            BTC Price (Live)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={btcPrice}
              onChange={(e) =>
                setBtcPrice(parseFloat(e.target.value) || 0)
              }
              className="flex-1 rounded-lg bg-white text-black placeholder-gray-500 border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={fetchBtcPrice}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg font-semibold"
            >
              {loadingPrice ? "..." : "↻"}
            </button>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-300 text-lg">
            Estimated Months to Reach 1 BTC:
          </p>
          <p className="text-3xl font-bold mt-2">
            {monthsToGoal > 0 ? `${monthsToGoal} months` : "--"}
          </p>
          <p className="text-gray-400 text-sm mt-3">
            Projection assumes BTC price and monthly investment remain constant.
          </p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-gray-800 rounded h-4 overflow-hidden">
            <div
              className="bg-orange-500 h-4"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">
            {progressPct.toFixed(2)}% Complete
          </p>
        </div>

      </div>
    </main>
  );
}
