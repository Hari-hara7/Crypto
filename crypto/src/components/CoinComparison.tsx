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

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
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
      } catch (err) {
        setError("Error fetching coin data.");
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
      } catch (err) {
        console.error("Error fetching stored coin data", err);
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

  const formatNumber = (num: number) => num.toLocaleString();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6">
        <h2 className="text-3xl text-teal-400 font-bold mb-4">
          Authentication Required
        </h2>
        <p className="text-lg text-gray-400">
          Please log in to use the Cryptocurrency Comparison Tool.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-400">
        Cryptocurrency Comparison Tool
      </h1>

      {/* Coin Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {coins.map((coin) => (
          <motion.button
            key={coin.id}
            onClick={() => handleSelectCoin(coin)}
            className={`p-4 rounded-lg shadow-lg transform hover:scale-105 ${
              selectedCoins.some((c) => c.id === coin.id)
                ? "bg-teal-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="w-12 h-12 mx-auto mb-2"
            />
            <div className="text-center">
              {coin.name} ({coin.symbol.toUpperCase()})
            </div>
          </motion.button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Selected Coins Table */}
      {coinData.length > 0 && (
        <motion.div
          className="overflow-x-auto shadow-lg mt-6 border-2 border-teal-500 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-teal-300 p-4">
            Selected Coins (Local)
          </h2>
          <table className="table-auto w-full text-left bg-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 border-b">Cryptocurrency</th>
                <th className="px-6 py-4 border-b">Price (USD)</th>
                <th className="px-6 py-4 border-b">Market Cap</th>
                <th className="px-6 py-4 border-b">24h Volume</th>
                <th className="px-6 py-4 border-b">Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {coinData.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-600">
                  <td className="px-6 py-4 flex items-center">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
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

      {/* Stored Coins Table with Delete Option */}
      {storedCoinData.length > 0 && (
        <motion.div
          className="overflow-x-auto shadow-lg mt-12 border-2 border-yellow-500 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-yellow-300 p-4">
            Your Stored Coins (Firebase)
          </h2>
          <table className="table-auto w-full text-left bg-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 border-b">Cryptocurrency</th>
                <th className="px-6 py-4 border-b">Price (USD)</th>
                <th className="px-6 py-4 border-b">Market Cap</th>
                <th className="px-6 py-4 border-b">24h Volume</th>
                <th className="px-6 py-4 border-b">Circulating Supply</th>
                <th className="px-6 py-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {storedCoinData.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-600">
                  <td className="px-6 py-4 flex items-center">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td className="px-6 py-4">${coin.current_price.toFixed(2)}</td>
                  <td className="px-6 py-4">${formatNumber(coin.market_cap)}</td>
                  <td className="px-6 py-4">${formatNumber(coin.total_volume)}</td>
                  <td className="px-6 py-4">{formatNumber(coin.circulating_supply)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDeleteStoredCoin(coin)}
                    >
                      🗑️
                    </button>
                  </td>
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
