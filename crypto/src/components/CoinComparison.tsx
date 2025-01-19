import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBitcoin, FaEthereum, FaLitecoin } from "react-icons/fa"; // Importing some icons
import { motion } from "framer-motion"; // Importing Framer Motion for animations

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string; // Added image field for icon
}

interface CoinData {
  id: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
}

const CoinComparison: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]); // List of available cryptocurrencies
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]); // List of selected coins
  const [coinData, setCoinData] = useState<CoinData[]>([]); // Data of selected coins
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of cryptocurrencies
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc", // Optional: Order coins by market cap
              per_page: 50, // Optional: Limit the number of coins shown
            },
          }
        );
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();
  }, []);

  // Fetch the data for selected coins
  useEffect(() => {
    if (selectedCoins.length === 0) return;

    const fetchCoinData = async () => {
      setLoading(true);
      setError(null);
      try {
        const coinIds = selectedCoins.map(coin => coin.id).join(",");
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: "usd",
              ids: coinIds,
            },
          }
        );
        setCoinData(response.data);
      } catch (error) {
        setError("Error fetching coin data.");
        console.error("Error fetching coin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoinData();
  }, [selectedCoins]);

  // Handle coin selection
  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoins((prev) => {
      if (prev.some((selectedCoin) => selectedCoin.id === coin.id)) {
        return prev.filter((selectedCoin) => selectedCoin.id !== coin.id);
      }
      return [...prev, coin];
    });
  };

  // Format numbers for readability
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-400">Coin Comparison Tool</h1>

      {/* Coin Selection Buttons - Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {coins.map((coin) => (
          <motion.button
            key={coin.id}
            onClick={() => handleSelectCoin(coin)}
            className={`p-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              selectedCoins.some((selectedCoin) => selectedCoin.id === coin.id)
                ? "bg-teal-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={coin.image} alt={coin.name} className="w-8 h-8 inline-block mb-2 mx-auto" />
            <div className="text-center">{coin.name} ({coin.symbol.toUpperCase()})</div>
          </motion.button>
        ))}
      </div>

      {/* Loading/Error Messages */}
      {loading && <p className="text-center text-gray-400">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Coin Data Table */}
      {coinData.length > 0 && (
        <motion.div
          className="overflow-x-auto shadow-lg mt-6 border-2 border-teal-500 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="table-auto w-full text-left bg-gray-800 rounded-lg">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-4 border-b">Cryptocurrency</th>
                <th className="px-6 py-4 border-b">Price (USD)</th>
                <th className="px-6 py-4 border-b">Market Cap (USD)</th>
                <th className="px-6 py-4 border-b">24h Volume (USD)</th>
                <th className="px-6 py-4 border-b">Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {coinData.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-600 hover:bg-gray-700">
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src={`https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}`}
                      alt={coin.name}
                      className="w-6 h-6 mr-2"
                    />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td className="px-6 py-4">${coin.current_price.toFixed(2)}</td>
                  <td className="px-6 py-4">${formatNumber(coin.market_cap)}</td>
                  <td className="px-6 py-4">${formatNumber(coin.total_volume)}</td>
                  <td className="px-6 py-4">{formatNumber(coin.circulating_supply)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default CoinComparison;
