// app/api/btc-price/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot", {
      // Server-side fetch, no CORS issues. Force fresh.
      cache: "no-store",
      headers: {
        "User-Agent": "zero-to-1btc",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Coinbase fetch failed:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch BTC price", status: res.status },
        { status: 500 }
      );
    }

    const data = await res.json();
    const price = Number(data?.data?.amount);

    if (!Number.isFinite(price)) {
      console.error("Unexpected Coinbase response:", data);
      return NextResponse.json(
        { error: "Invalid BTC price response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ price });
  } catch (err: any) {
    console.error("BTC price route crashed:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch BTC price" }, { status: 500 });
  }
}
