"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [btcHoldings, setBtcHoldings] = useState<string>("0.01");
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("300");

  // live price
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // fetch BTC price from your API route
  const fetchBtcPrice = async () => {
    try {
      setLoadingPrice(true);
      setPriceError(null);

      const res = await fetch("/api/btc-price", { cache: "no-store" });
      if (!res.ok) throw new Error("Bad response from /api/btc-price");

      const data = await res.json();
      if (typeof data?.price !== "number") throw new Error("Invalid price data");

      setBtcPrice(data.price);
    } catch (e: any) {
      setPriceError("Could not fetch live BTC price.");
      setBtcPrice(null);
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    fetchBtcPrice();
  }, []);

  const holdingsNum = useMemo(() => {
    const n = parseFloat(btcHoldings);
    return Number.isFinite(n) ? n : 0;
  }, [btcHoldings]);

  const monthlyUsdNum = useMemo(() => {
    const n = parseFloat(monthlyInvestment);
    return Number.isFinite(n) ? n : 0;
  }, [monthlyInvestment]);

  const btcRemaining = useMemo(() => {
    return Math.max(0, 1 - holdingsNum);
  }, [holdingsNum]);

  const monthlyBtc = useMemo(() => {
    if (!btcPrice || btcPrice <= 0) return 0;
    return monthlyUsdNum / btcPrice;
  }, [monthlyUsdNum, btcPrice]);

  const monthsToGoal = useMemo(() => {
    if (!btcPrice || btcPrice <= 0) return 0;
    if (monthlyBtc <= 0) return 0;
    if (btcRemaining <= 0) return 0;
    return Math.ceil(btcRemaining / monthlyBtc);
  }, [btcPrice, monthlyBtc, btcRemaining]);

  const progressPct = useMemo(() => {
    const pct = holdingsNum * 100;
    return Math.max(0, Math.min(100, pct));
  }, [holdingsNum]);

  // ✅ NEW: USD value of holdings
  const holdingsUsd = useMemo(() => {
    if (!btcPrice || btcPrice <= 0) return null;
    return holdingsNum * btcPrice;
  }, [holdingsNum, btcPrice]);

  const formatUsd = (value: number) =>
    value.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-5xl font-bold text-center mb-12">Road to 1 BTC</h1>

        <div className="space-y-10">
          {/* BTC holdings */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              Current BTC Holdings
            </label>
            <input
              type="number"
              step="0.00000001"
              inputMode="decimal"
              value={btcHoldings}
              onChange={(e) => setBtcHoldings(e.target.value)}
              className="w-full text-black bg-white rounded-xl p-4 text-xl outline-none border-2 border-transparent focus:border-orange-500"
            />

            {/* ✅ NEW: USD value display */}
            <div className="mt-3 text-gray-200">
              {btcPrice && holdingsUsd !== null ? (
                <span>
                  Your BTC is worth:{" "}
                  <span className="font-semibold text-white">
                    {formatUsd(holdingsUsd)}
                  </span>
                </span>
              ) : (
                <span className="text-gray-400">Your BTC value will appear once price loads.</span>
              )}
            </div>
          </div>

          {/* Monthly investment */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              Monthly Investment (USD)
            </label>
            <input
              type="number"
              step="1"
              inputMode="numeric"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="w-full text-black bg-white rounded-xl p-4 text-xl outline-none border-2 border-transparent focus:border-orange-500"
            />
          </div>

          {/* BTC live price */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              BTC Price (Live)
            </label>

            <div className="flex gap-4">
              <input
                type="text"
                readOnly
                value={
                  btcPrice
                    ? btcPrice.toLocaleString(undefined, { maximumFractionDigits: 3 })
                    : loadingPrice
                    ? "Loading..."
                    : "—"
                }
                className="flex-1 text-black bg-white rounded-xl p-4 text-xl outline-none border-2 border-transparent"
              />

              <button
                onClick={fetchBtcPrice}
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl px-5 text-xl font-semibold"
                title="Refresh price"
              >
                ↻
              </button>
            </div>

            {priceError && (
              <p className="mt-2 text-red-400 text-sm">{priceError}</p>
            )}

            {btcPrice && (
              <p className="mt-2 text-gray-400 text-sm">
                Monthly buy ≈ {(monthlyBtc || 0).toFixed(8)} BTC
              </p>
            )}
          </div>

          {/* Results card */}
          <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-700">
            <p className="text-2xl text-gray-200">Estimated Months to Reach 1 BTC:</p>
            <p className="text-5xl font-bold mt-4">
              {monthsToGoal > 0 ? `${monthsToGoal} months` : "—"}
            </p>
            <p className="text-gray-400 mt-4">
              Projection assumes BTC price and monthly investment remain constant.
            </p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full bg-slate-800 rounded-full h-5 overflow-hidden">
              <div
                className="bg-orange-500 h-5"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-3 text-xl text-gray-200">
              {progressPct.toFixed(2)}% Complete
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
