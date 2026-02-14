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

  const progress = Math.min((currentBtc / 1) * 100, 100);
  const btcValue = currentBtc * btcPrice;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        color: "white",
        padding: "60px 20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Your Road to 1 Bitcoin
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "12px" }}>
          Enter your numbers below and see how long it could take you to reach 1 BTC.
        </p>
        <p style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.7 }}>
          For educational and planning purposes only. Bitcoin prices change daily.
        </p>
      </div>

      {/* BTC Price */}
      <div style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
        Current BTC Price: ${btcPrice.toLocaleString()}
      </div>

      {/* Current BTC Input */}
      <div style={{ marginBottom: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Current BTC Owned:
        </label>
        <input
          type="number"
          value={currentBtc}
          onChange={(e) => setCurrentBtc(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "1px solid #f7931a",
            backgroundColor: "#1f1f1f",
            color: "white",
            outline: "none",
          }}
        />
        <div style={{ marginTop: "10px", opacity: 0.8 }}>
          That’s worth ${btcValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} at the current price.
        </div>
      </div>

      {/* Monthly Investment Input */}
      <div style={{ marginBottom: "40px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Monthly Investment (USD):
        </label>
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "1px solid #f7931a",
            backgroundColor: "#1f1f1f",
            color: "white",
            outline: "none",
          }}
        />
      </div>

      {/* Results */}
      <div style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
        Monthly BTC Accumulation: {monthlyBtc.toFixed(6)} BTC
      </div>

      <div style={{ marginBottom: "10px", fontSize: "1.4rem", fontWeight: "bold" }}>
        Time to Reach 1 BTC: {monthsToGoal} months
      </div>

      {monthsToGoal > 0 && (
        <div style={{ marginBottom: "20px", fontSize: "1.1rem", opacity: 0.9 }}>
          That’s approximately {years} year{years !== 1 && "s"} and{" "}
          {months} month{months !== 1 && "s"}.
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        Progress: {progress.toFixed(2)}%
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: "28px",
          width: "100%",
          backgroundColor: "#333",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "#f7931a",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
