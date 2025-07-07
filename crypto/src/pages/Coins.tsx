import { FC, useState, useEffect } from "react";
import { fetchCoins } from "../services/api";
import { Coin } from "../services/types";
import CoinCard from "../components/CoinCard";
import FilterBar from "../components/FilterBar";
import HistoricalChart from "../components/HistoricalChart";
import { motion } from "framer-motion";

const Coins: FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCoins = async () => {
      setLoading(true);
      const data = await fetchCoins();
      setCoins(data);
      setFilteredCoins(data);
      setLoading(false);
    };
    getCoins();
  }, []);

  const handleSortChange = (value: string) => {
    const sorted = [...filteredCoins].sort((a, b) =>
      value === "price"
        ? b.current_price - a.current_price
        : value === "volume"
        ? b.total_volume - a.total_volume
        : b.market_cap - a.market_cap
    );
    setFilteredCoins(sorted);
  };

  const handleFilterChange = (value: string) => {
    const filtered = coins.filter((coin) =>
      coin.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  const handleCoinSelection = (coinId: string) => {
    setSelectedCoin(coinId);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-gray-100">
      {/* Page Header */}
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-teal-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Cryptocurrency Tracker
      </motion.h1>

      {/* Filter Bar */}
      <motion.div
        className="mb-6 bg-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FilterBar
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Coin Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {filteredCoins.map((coin) => (
          <motion.div
            key={coin.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CoinCard
              coin={coin}
              onClick={() => handleCoinSelection(coin.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Historical Data Chart */}
      {selectedCoin && !loading && (
        <motion.div
          className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-teal-400 mb-4">
            Historical Data for {selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}
          </h2>
          <HistoricalChart cryptoId={selectedCoin} />
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          className="flex justify-center items-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-teal-400 animate-pulse">
            Loading data...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Coins;
