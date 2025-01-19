import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoricalChartProps {
  cryptoId: string;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ cryptoId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [selectedInterval, setSelectedInterval] = useState<string>("1d");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mapping of time intervals to CoinGecko API time ranges
  const timeIntervals: Record<string, string> = {
    "1h": "hourly",
    "1d": "daily",
    "7d": "weekly",
    "30d": "monthly",
    "1y": "yearly",
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: timeIntervals[selectedInterval] === "hourly" ? "1" : selectedInterval, // 1d -> 1, 7d -> 7, etc.
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
              label: `${cryptoId} Price (USD)`,
              data,
              fill: false,
              borderColor: "#3498db",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        setError("Error fetching historical data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [cryptoId, selectedInterval]);

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Historical Data</h2>
      <div className="text-center mb-4">
        <button
          onClick={() => handleIntervalChange("1h")}
          className={`py-2 px-4 mx-2 ${selectedInterval === "1h" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1 Hour
        </button>
        <button
          onClick={() => handleIntervalChange("1d")}
          className={`py-2 px-4 mx-2 ${selectedInterval === "1d" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1 Day
        </button>
        <button
          onClick={() => handleIntervalChange("7d")}
          className={`py-2 px-4 mx-2 ${selectedInterval === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          7 Days
        </button>
        <button
          onClick={() => handleIntervalChange("30d")}
          className={`py-2 px-4 mx-2 ${selectedInterval === "30d" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          30 Days
        </button>
        <button
          onClick={() => handleIntervalChange("1y")}
          className={`py-2 px-4 mx-2 ${selectedInterval === "1y" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          1 Year
        </button>
      </div>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default HistoricalChart;
