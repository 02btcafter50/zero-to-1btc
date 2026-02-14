"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [currentBtc, setCurrentBtc] = useState<number>(0.21);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1000);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const monthlyBtc = btcPrice > 0 ? monthlyInvestment / btcPrice : 0;
  const remainingBtc = 1 - currentBtc;
  const monthsToGoal =
    monthlyBtc > 0 && remainingBtc > 0
      ? Math.ceil(remainingBtc / monthlyBtc)
      : 0;

  const years = Math.floor(monthsToGoal / 12);
  const months = monthsToGoal % 12;

  const progress = (currentBtc / 1) * 100;
  const btcValue = currentBtc * btcPrice;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      {/* Headline Section */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Your Road to 1 Bitcoin
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
          Enter your numbers below and see how long it could take you to reach 1 BTC.
        </p>
        <p style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.7 }}>
          For educational and planning purposes only. Bitcoin prices change daily.
        </p>
      </div>

      {/* Price */}
      <h2>Current BTC Price: ${btcPrice.toLocaleString()}</h2>

      {/* Inputs */}
      <div style={{ marginTop: "30px" }}>
        <label>
          Current BTC Owned:
          <input
            type="number"
            value={currentBtc}
            onChange={(e) => setCurrentBtc(Number(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Monthly Investment (USD):
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      {/* Results */}
      <div style={{ marginTop: "40px" }}>
        <h3>Your BTC is Worth: ${btcValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>

        <h3>
          Monthly BTC Accumulation: {monthlyBtc.toFixed(6)} BTC
        </h3>

        <h3>
          Time to Reach 1 BTC: {monthsToGoal} months
        </h3>

        {monthsToGoal > 0 && (
          <h3>
            That’s approximately {years} year{years !== 1 && "s"}{" "}
            and {months} month{months !== 1 && "s"}
          </h3>
        )}

        <h3>Progress: {progress.toFixed(2)}%</h3>

        <div
          style={{
            height: "25px",
            width: "100%",
            backgroundColor: "#333",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#f7931a",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
