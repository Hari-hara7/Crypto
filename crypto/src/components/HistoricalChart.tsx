import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Time intervals for CoinGecko API
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCryptos, setAvailableCryptos] = useState<any[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptoId);

  // Fetch available cryptocurrencies
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        setAvailableCryptos(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrency list:", error);
      }
    };
    fetchCryptos();
  }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
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
              label: `${selectedCrypto} Price (USD)`,
              data,
              fill: false,
              borderColor: "#3498db",
              tension: 0.1,
            },
          ],
        });
      } catch (error: any) {
        setError(error?.response?.data?.message || "Error fetching historical data.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCrypto) {
      fetchHistoricalData();
    }
  }, [selectedCrypto, selectedInterval]);

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrypto(e.target.value);
  };

  if (loading) return <div className="text-white text-center">Loading chart... <div className="spinner"></div></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-white text-center mb-4">Historical Data</h2>
      
      {/* Crypto Selection Dropdown */}
      <div className="text-center mb-4">
        <select
          value={selectedCrypto}
          onChange={handleCryptoChange}
          className="py-2 px-4 rounded-full bg-gray-700 text-gray-300"
        >
          {availableCryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Interval Buttons */}
      <div className="text-center mb-4 flex justify-center space-x-3">
        {["1h", "1d", "7d", "30d", "1y"].map((interval) => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval)}
            className={`py-2 px-4 rounded-full transition duration-300 mx-2 
              ${selectedInterval === interval ? "bg-blue-500 text-white border-2 border-blue-600" : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"}`}
          >
            {interval === "1h" ? "1 Hour" : interval === "1d" ? "1 Day" : interval === "7d" ? "7 Days" : interval === "30d" ? "30 Days" : "1 Year"}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default HistoricalChart;
