"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { auth, db } from "../utils/firebaseConfig";
import {
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Time intervals
const timeIntervals: Record<string, string> = {
  "1h": "hourly",
  "1d": "daily",
  "7d": "weekly",
  "30d": "monthly",
  "1y": "yearly",
};

interface HistoricalChartProps {
  cryptoId: string;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ cryptoId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [selectedInterval, setSelectedInterval] = useState<string>("1d");
  const [availableCryptos, setAvailableCryptos] = useState<any[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptoId);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for Firebase Auth state
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // Fetch top 50 coins by market cap
  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
          },
        });
        setAvailableCryptos(response.data);
      } catch (err) {
        console.error("Error fetching top coins:", err);
      }
    };
    fetchTopCryptos();
  }, []);

  // Fetch historical price data
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: timeIntervals[selectedInterval] === "hourly" ? "1" : selectedInterval,
            },
          }
        );

        const prices = response.data.prices;
        const labels = prices.map((item: any) => new Date(item[0]).toLocaleTimeString());
        const data = prices.map((item: any) => item[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${selectedCrypto.toUpperCase()} Price (USD)`,
              data,
              fill: false,
              borderColor: "#3498db", // blue
              tension: 0.3,
            },
          ],
        });

        // Save selection in Firestore
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          await setDoc(userDoc, {
            selectedCrypto,
            selectedInterval,
          }, { merge: true });
        }

      } catch (err: any) {
        setError(err?.response?.data?.message || "Error fetching chart data.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCrypto && selectedInterval) {
      fetchChartData();
    }
  }, [selectedCrypto, selectedInterval, user]);

  // Listen to Firestore for real-time updates
  useEffect(() => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDoc, (docSnap) => {
      const data = docSnap.data();
      if (data?.selectedCrypto) setSelectedCrypto(data.selectedCrypto);
      if (data?.selectedInterval) setSelectedInterval(data.selectedInterval);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Card className="w-full bg-[#1c1c1e] text-white max-w-4xl mx-auto mt-6 p-4 md:p-6">
      <CardHeader>
        <CardTitle className="text-center text-2xl">📈 Crypto Historical Chart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropdown */}
        <div className="text-center">
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="w-full md:w-72 p-2 rounded-md bg-blue-900 text-white border border-blue-500 focus:outline-none"
          >
            <option value="" disabled>Select Crypto</option>
            {availableCryptos.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Interval Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {["1h", "1d", "7d", "30d", "1y"].map((interval) => (
            <Button
              key={interval}
              variant={selectedInterval === interval ? "default" : "outline"}
              className={`text-sm ${selectedInterval === interval ? "bg-blue-600 text-white" : "border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"}`}
              onClick={() => setSelectedInterval(interval)}
            >
              {interval === "1h"
                ? "1 Hour"
                : interval === "1d"
                ? "1 Day"
                : interval === "7d"
                ? "7 Days"
                : interval === "30d"
                ? "30 Days"
                : "1 Year"}
            </Button>
          ))}
        </div>

        {/* Chart */}
        {loading ? (
          <p className="text-center text-yellow-400">Loading chart...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          chartData && (
            <div className="w-full overflow-x-auto">
              <Line data={chartData} />
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;
