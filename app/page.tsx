// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [btcHoldings, setBtcHoldings] = useState<number>(0.01);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(300);

  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ---- Live price fetch (manual + auto refresh)
  const fetchBtcPrice = async () => {
    setIsLoadingPrice(true);
    setPriceError(null);

    try {
      const res = await fetch("/api/btc-price", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { price?: number; error?: string };
      if (typeof data.price !== "number") {
        throw new Error(data.error || "No price returned");
      }

      setBtcPrice(data.price);
      setLastUpdated(new Date());
    } catch (e: any) {
      setPriceError(e?.message || "Failed to fetch BTC price");
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Fetch once on load + refresh every 60 seconds
  useEffect(() => {
    fetchBtcPrice();
    const id = setInterval(fetchBtcPrice, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Calculations
  const remainingBtc = Math.max(0, 1 - btcHoldings);

  const monthsToGoal = useMemo(() => {
    if (!btcPrice || btcPrice <= 0) return 0;
    if (monthlyInvestment <= 0) return 0;

    const btcPerMonth = monthlyInvestment / btcPrice;
    if (btcPerMonth <= 0) return 0;

    return Math.ceil(remainingBtc / btcPerMonth);
  }, [btcPrice, monthlyInvestment, remainingBtc]);

  const progressPct = Math.min(100, Math.max(0, btcHoldings * 100));

  const holdingsUsd = useMemo(() => {
    if (!btcPrice) return null;
    return btcHoldings * btcPrice;
  }, [btcHoldings, btcPrice]);

  const timeBreakdown = useMemo(() => {
    if (monthsToGoal <= 0) return "—";

    const years = Math.floor(monthsToGoal / 12);
    const months = monthsToGoal % 12;

    if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
    if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;

    return `${years} year${years === 1 ? "" : "s"} ${months} month${
      months === 1 ? "" : "s"
    }`;
  }, [monthsToGoal]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12">
          Road to 1 BTC
        </h1>

        <div className="space-y-8">
          {/* Current BTC Holdings */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              Current BTC Holdings
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.0001"
              min={0}
              max={1}
              value={Number.isFinite(btcHoldings) ? btcHoldings : 0}
              onChange={(e) => setBtcHoldings(parseFloat(e.target.value || "0"))}
              className="w-full rounded-lg border border-gray-300 bg-white text-black px-4 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {holdingsUsd !== null && (
              <p className="text-gray-300 mt-2 text-lg">
                That’s worth{" "}
                <span className="font-semibold">
                  ${holdingsUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>{" "}
                at the current price.
              </p>
            )}
          </div>

          {/* Monthly Investment */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              Monthly Investment (USD)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="1"
              min={0}
              value={Number.isFinite(monthlyInvestment) ? monthlyInvestment : 0}
              onChange={(e) =>
                setMonthlyInvestment(parseFloat(e.target.value || "0"))
              }
              className="w-full rounded-lg border border-gray-300 bg-white text-black px-4 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* BTC Price (Live) */}
          <div>
            <label className="block text-xl text-gray-200 mb-3">
              BTC Price (Live)
            </label>

            <div className="flex items-stretch gap-4">
              <input
                type="text"
                readOnly
                value={
                  btcPrice !== null
                    ? btcPrice.toLocaleString(undefined, { maximumFractionDigits: 3 })
                    : isLoadingPrice
                    ? "Loading..."
                    : "—"
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white text-black px-4 py-4 text-xl focus:outline-none"
              />

              <button
                onClick={fetchBtcPrice}
                disabled={isLoadingPrice}
                className="w-14 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-2xl"
                title="Refresh price"
                aria-label="Refresh price"
              >
                ↻
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Auto-updates every 60 seconds.</span>
              {lastUpdated && (
                <span>
                  Last update:{" "}
                  {lastUpdated.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              )}
              {priceError && (
                <span className="text-red-300">Price error: {priceError}</span>
              )}
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-700">
            <p className="text-2xl text-gray-200">Estimated Time to Reach 1 BTC:</p>

            <p className="text-5xl font-bold mt-4">
              {monthsToGoal > 0 ? `${monthsToGoal} months` : "—"}
            </p>

            <p className="text-gray-300 mt-3 text-xl">{timeBreakdown}</p>

            <p className="text-gray-400 mt-4">
              Projection assumes BTC price and monthly investment remain constant.
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="w-full bg-slate-800 rounded h-4 overflow-hidden">
              <div
                className="bg-orange-500 h-4"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-lg text-gray-200 mt-3">
              {progressPct.toFixed(2)}% Complete
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
