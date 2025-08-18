import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { auth, db } from "../utils/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { 
  FaSearch, 
  FaTrashAlt, 
  FaStar, 
  FaChartLine, 
  FaCoins, 
  FaArrowUp, 
  FaArrowDown,
  FaFilter,
  FaSync,
  FaPlus
} from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  market_cap_rank?: number;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  image: string;
}

const CoinComparison: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]);
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [storedCoinData, setStoredCoinData] = useState<CoinData[]>([]);
  const [storedCoins, setStoredCoins] = useState<Coin[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"market_cap" | "price" | "volume">("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"all" | "selected" | "stored">("all");

  // Particles configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    particles: {
      color: { value: "#00FFCC" },
      links: { 
        enable: true, 
        color: "#00FFCC", 
        distance: 150,
        opacity: 0.4
      },
      move: { enable: true, speed: 1.5 },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: { min: 0.3, max: 0.6 } },
      number: { value: 50 }
    },
  };

  // Track authentication & Firestore coins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        await setDoc(userDoc, { selectedCoins: [] }, { merge: true });

        onSnapshot(userDoc, (docSnap) => {
          const data = docSnap.data();
          if (data?.selectedCoins) {
            setStoredCoins(data.selectedCoins);
          }
        });
      } else {
        setUser(null);
        setStoredCoins([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch all available coins
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 50,
            },
          }
        );
        setCoins(response.data);
      } catch (err) {
        setError("Failed to fetch coin list.");
        console.error(err);
      }
    };

    fetchCoins();
  }, []);

  // Fetch selected coin data
  useEffect(() => {
    const fetchCoinData = async () => {
      if (selectedCoins.length === 0) return;

      setLoading(true);
      try {
        const ids = selectedCoins.map((coin) => coin.id).join(",");
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", ids },
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

  // Fetch stored coins data
  useEffect(() => {
    const fetchStoredData = async () => {
      if (storedCoins.length === 0) return setStoredCoinData([]);

      try {
        const ids = storedCoins.map((coin) => coin.id).join(",");
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", ids },
          }
        );
        setStoredCoinData(response.data);
      } catch (error) {
        console.error("Error fetching stored coin data", error);
      }
    };

    fetchStoredData();
  }, [storedCoins]);

  // Handle coin selection
  const handleSelectCoin = async (coin: Coin) => {
    const isSelected = selectedCoins.some((c) => c.id === coin.id);
    const updated = isSelected
      ? selectedCoins.filter((c) => c.id !== coin.id)
      : [...selectedCoins, coin];

    setSelectedCoins(updated);

    if (user) {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        selectedCoins: isSelected
          ? arrayRemove(coin)
          : arrayUnion(coin),
      });
    }
  };

  // Delete from stored coins
  const handleDeleteStoredCoin = async (coin: Coin) => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      selectedCoins: arrayRemove(coin),
    });
  };

  // Refresh coin data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh all coins list
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 100,
          },
        }
      );
      setCoins(response.data);

      // Refresh selected coins data
      if (selectedCoins.length > 0) {
        const ids = selectedCoins.map((coin) => coin.id).join(",");
        const selectedResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", ids },
          }
        );
        setCoinData(selectedResponse.data);
      }

      // Refresh stored coins data
      if (storedCoins.length > 0) {
        const ids = storedCoins.map((coin) => coin.id).join(",");
        const storedResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: { vs_currency: "usd", ids },
          }
        );
        setStoredCoinData(storedResponse.data);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort coins
  const getFilteredCoins = () => {
    let filtered = coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory === "selected") {
      filtered = filtered.filter((coin) =>
        selectedCoins.some((c) => c.id === coin.id)
      );
    } else if (filterCategory === "stored") {
      filtered = filtered.filter((coin) =>
        storedCoins.some((c) => c.id === coin.id)
      );
    }

    return filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "price":
          aValue = a.current_price || 0;
          bValue = b.current_price || 0;
          break;
        case "market_cap":
          aValue = a.market_cap_rank || 999;
          bValue = b.market_cap_rank || 999;
          break;
        default:
          aValue = a.market_cap_rank || 999;
          bValue = b.market_cap_rank || 999;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPrice = (price: number) => price.toFixed(price >= 1 ? 2 : 6);
  const formatPercentage = (percentage: number) => {
    const color = percentage >= 0 ? "text-green-400" : "text-red-400";
    const icon = percentage >= 0 ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />;
    return (
      <span className={color}>
        {percentage.toFixed(2)}% {icon}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center p-6 relative">
        <Particles
          id="tsparticles-auth"
          init={particlesInit}
          options={particlesOptions}
          className="absolute top-0 left-0 h-full w-full"
        />
        <motion.div 
          className="text-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaCoins className="text-6xl text-teal-400 mx-auto mb-6" />
          <h2 className="text-4xl text-teal-400 font-bold mb-4">
            Authentication Required
          </h2>
          <p className="text-lg text-gray-400 max-w-md">
            Please log in to access the Cryptocurrency Comparison Tool and start comparing your favorite coins.
          </p>
        </motion.div>
      </div>
    );
  }

  const filteredCoins = getFilteredCoins();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      <Particles
        id="tsparticles-comparison"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 h-full w-full"
      />
      
      <div className="relative z-10 p-6">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            <FaChartLine className="inline-block mr-4 text-teal-400" />
            Cryptocurrency Comparison
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compare, analyze, and track your favorite cryptocurrencies with real-time data and advanced filtering.
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div 
          className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Sort By */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "market_cap" | "price" | "volume")}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white appearance-none"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
              </select>
            </div>

            {/* Filter Category */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as "all" | "selected" | "stored")}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white appearance-none"
              >
                <option value="all">All Coins</option>
                <option value="selected">Selected Only</option>
                <option value="stored">Stored Only</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors duration-200"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors duration-200"
            >
              {sortOrder === "asc" ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FiInfo className="text-2xl text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{coins.length}</div>
              <div className="text-sm text-gray-400">Available Coins</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaPlus className="text-2xl text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{selectedCoins.length}</div>
              <div className="text-sm text-gray-400">Selected Coins</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaStar className="text-2xl text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{storedCoins.length}</div>
              <div className="text-sm text-gray-400">Stored Coins</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaCoins className="text-2xl text-teal-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{filteredCoins.length}</div>
              <div className="text-sm text-gray-400">Filtered Results</div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaSync className="animate-spin text-4xl text-teal-400 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Loading cryptocurrency data...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Coin Selection Grid */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
            <FaCoins className="mr-3" />
            Select Cryptocurrencies to Compare
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCoins.map((coin, index) => (
              <motion.button
                key={coin.id}
                onClick={() => handleSelectCoin(coin)}
                className={`relative p-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 border-2 ${
                  selectedCoins.some((c) => c.id === coin.id)
                    ? "bg-teal-600/30 border-teal-400 shadow-teal-400/25"
                    : "bg-gray-800/60 border-gray-600 hover:bg-gray-700/60 hover:border-gray-500"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedCoins.some((c) => c.id === coin.id) && (
                  <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 mx-auto mb-3"
                />
                <div className="text-center">
                  <div className="font-semibold text-white text-sm mb-1">{coin.name}</div>
                  <div className="text-gray-400 text-xs uppercase">{coin.symbol}</div>
                  {coin.current_price && (
                    <div className="text-teal-400 text-sm font-medium mt-1">
                      ${formatPrice(coin.current_price)}
                    </div>
                  )}
                  {coin.price_change_percentage_24h !== undefined && (
                    <div className="text-xs mt-1">
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selected Coins Comparison Table */}
        {coinData.length > 0 && (
          <motion.div
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-teal-300 flex items-center">
                <FaChartLine className="mr-3" />
                Selected Coins Comparison
              </h2>
              <p className="text-gray-400 mt-2">Real-time comparison of your selected cryptocurrencies</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Cryptocurrency</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Price (USD)</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">24h Change</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Market Cap</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Volume (24h)</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Supply</th>
                    <th className="px-6 py-4 text-teal-400 font-semibold">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {coinData.map((coin, index) => (
                    <motion.tr 
                      key={coin.id} 
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3 rounded-full" />
                          <div>
                            <div className="font-semibold text-white">{coin.name}</div>
                            <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-white">
                          ${formatPrice(coin.current_price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </td>
                      <td className="px-6 py-4 text-white">${formatNumber(coin.market_cap)}</td>
                      <td className="px-6 py-4 text-white">${formatNumber(coin.total_volume)}</td>
                      <td className="px-6 py-4 text-white">{formatNumber(coin.circulating_supply)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-sm">
                          #{coin.market_cap_rank}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Stored Coins Table */}
        {storedCoinData.length > 0 && (
          <motion.div
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-300 flex items-center">
                <FaStar className="mr-3" />
                Your Stored Coins
              </h2>
              <p className="text-gray-400 mt-2">Your saved cryptocurrency watchlist with persistent storage</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Cryptocurrency</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Price (USD)</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">24h Change</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Market Cap</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Volume (24h)</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Supply</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold">Rank</th>
                    <th className="px-6 py-4 text-yellow-400 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {storedCoinData.map((coin, index) => (
                    <motion.tr 
                      key={coin.id} 
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3 rounded-full" />
                          <div>
                            <div className="font-semibold text-white">{coin.name}</div>
                            <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-white">
                          ${formatPrice(coin.current_price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </td>
                      <td className="px-6 py-4 text-white">${formatNumber(coin.market_cap)}</td>
                      <td className="px-6 py-4 text-white">${formatNumber(coin.total_volume)}</td>
                      <td className="px-6 py-4 text-white">{formatNumber(coin.circulating_supply)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">
                          #{coin.market_cap_rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center mx-auto"
                          onClick={() => handleDeleteStoredCoin(coin)}
                          title="Remove from watchlist"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty States */}
        {!loading && coinData.length === 0 && selectedCoins.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <FaCoins className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Coins Selected</h3>
            <p className="text-gray-500">Select some cryptocurrencies above to start comparing their data.</p>
          </motion.div>
        )}

        {!loading && storedCoinData.length === 0 && storedCoins.length === 0 && (
          <motion.div 
            className="text-center py-8 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <FaStar className="text-4xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Stored Coins</h3>
            <p className="text-gray-500">Your selected coins will be automatically saved to your watchlist.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoinComparison;
