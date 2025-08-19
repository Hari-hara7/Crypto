import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaExchangeAlt, 
  FaSpinner, 
  FaHistory, 
  FaTrash, 
  FaCopy,
  FaCalculator,
  FaChartLine,
  FaCoins,
  FaDollarSign,
  FaFire,
  FaArrowRight,
  FaClock
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { auth, db } from '../utils/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface ConversionRecord {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: Timestamp | null;
}

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

const CryptoConverter = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Particles configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "#0d1117" } },
    particles: {
      color: { value: "#00FFCC" },
      links: { enable: true, color: "#00FFCC", distance: 150 },
      move: { enable: true, speed: 1.5 },
      size: { value: { min: 1, max: 4 } },
      opacity: { value: { min: 0.3, max: 0.7 } },
    },
  };

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchConversionHistory(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch coin and fiat lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        setCryptos(cryptoRes.data);

        const fiatRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(fiatRes.data.rates));
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch conversion rate
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        setLoading(true);
        if (fromCurrency && toCurrency) {
          const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`
          );
          setConversionRate(res.data[fromCurrency][toCurrency]);
        }
      } catch (error) {
        console.error('Error fetching conversion rate', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversionRate();
  }, [fromCurrency, toCurrency]);

  // Perform conversion and save to Firestore
  useEffect(() => {
    if (conversionRate && amount) {
      const result = amount * conversionRate;
      setConvertedAmount(result);

      if (user && result > 0) {
        const saveConversion = async () => {
          try {
            await addDoc(collection(db, "users", user.uid, "conversions"), {
              from: fromCurrency,
              to: toCurrency,
              amount: parseFloat(amount.toString()),
              result,
              rate: conversionRate,
              timestamp: serverTimestamp()
            });
            fetchConversionHistory(user.uid);
          } catch (error) {
            console.error("Error saving conversion: ", error);
          }
        };
        saveConversion();
      }
    }
  }, [conversionRate, amount, user, fromCurrency, toCurrency]);

  // Utility functions
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/coins/list');
      setCryptos(cryptoRes.data);
      
      const fiatRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setCurrencies(Object.keys(fiatRes.data.rates));
    } catch (error) {
      console.error('Error refreshing data', error);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Fetch user's past conversions
  const fetchConversionHistory = async (uid: string) => {
    try {
      const q = query(collection(db, "users", uid, "conversions"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          from: docData.from || '',
          to: docData.to || '',
          amount: docData.amount || 0,
          result: docData.result || 0,
          rate: docData.rate || 0,
          timestamp: docData.timestamp || null
        } as ConversionRecord;
      });
      setConversionHistory(data);
      console.log('Fetched conversion history:', data); // Debug log
    } catch (error) {
      console.error("Error fetching history: ", error);
    }
  };

  // Clear conversion history
  const clearConversionHistory = async () => {
    if (!user) return;

    try {
      const q = query(collection(db, "users", user.uid, "conversions"));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", user.uid, "conversions", docSnap.id))
      );

      await Promise.all(deletePromises);
      setConversionHistory([]);
      alert("Conversion history cleared!");
    } catch (error) {
      console.error("Error clearing history: ", error);
      alert("Failed to clear history.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles-converter"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 h-full w-full z-0"
      />

      <div className="relative z-10 p-4 md:p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 drop-shadow-lg mb-4 md:mb-6">
            <FaCalculator className="inline-block mr-3 text-teal-400" />
            Crypto Converter Pro
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
            Convert cryptocurrencies to fiat currencies with real-time rates and track your conversion history.
          </p>
        </motion.div>

        {/* Main Converter Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Converter Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-teal-400 flex items-center">
                  <FaExchangeAlt className="mr-3" />
                  Currency Converter
                </h2>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''} text-teal-400`} />
                  </motion.button>
                  <motion.button
                    onClick={swapCurrencies}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaExchangeAlt className="text-teal-400" />
                  </motion.button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FaDollarSign className="inline mr-2" />
                  Amount
                </label>
                <motion.input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none text-lg"
                  placeholder="Enter amount to convert"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* From Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaCoins className="inline mr-2" />
                    From (Cryptocurrency)
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none"
                  >
                    {cryptos.slice(0, 100).map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.name} ({crypto.symbol?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaDollarSign className="inline mr-2" />
                    To (Fiat Currency)
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-teal-400 focus:outline-none"
                  >
                    {currencies.slice(0, 50).map((currency) => (
                      <option key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Result */}
              <motion.div
                className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 p-6 rounded-xl border border-teal-400/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Converted Amount</h3>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin text-teal-400 text-2xl mr-3" />
                      <span className="text-teal-400">Converting...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                        {convertedAmount ? 
                          `${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${toCurrency.toUpperCase()}` 
                          : 'Enter amount to convert'
                        }
                      </div>
                      {conversionRate && (
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                          <span>1 {fromCurrency.toUpperCase()} = {conversionRate.toLocaleString()} {toCurrency.toUpperCase()}</span>
                          <motion.button
                            onClick={() => copyToClipboard(`${convertedAmount} ${toCurrency.toUpperCase()}`)}
                            className="text-teal-400 hover:text-teal-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaCopy />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats and Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Market Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
                <FaChartLine className="mr-2" />
                Market Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Cryptos</span>
                  <span className="text-white font-semibold">{cryptos.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Fiat Currencies</span>
                  <span className="text-white font-semibold">{currencies.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your Conversions</span>
                  <span className="text-white font-semibold">{conversionHistory.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
                <FaFire className="mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    console.log('Toggle history clicked. Current state:', showHistory);
                    console.log('User:', user);
                    console.log('History length:', conversionHistory.length);
                    setShowHistory(!showHistory);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center">
                    <FaHistory className="mr-2 text-teal-400" />
                    {showHistory ? 'Hide History' : 'View History'}
                  </span>
                  <FaArrowRight className="text-gray-400" />
                </motion.button>
                
                <motion.button
                  onClick={clearConversionHistory}
                  disabled={conversionHistory.length === 0}
                  className="w-full flex items-center justify-between p-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center">
                    <FaTrash className="mr-2 text-red-400" />
                    Clear History
                  </span>
                </motion.button>

                {user && (
                  <motion.button
                    onClick={() => {
                      console.log('Manual refresh history for user:', user.uid);
                      fetchConversionHistory(user.uid);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="flex items-center">
                      <FiRefreshCw className="mr-2 text-blue-400" />
                      Refresh History
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Conversion History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-7xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-teal-400 flex items-center">
                  <FaHistory className="mr-3" />
                  Conversion History
                </h3>
                <span className="text-sm text-gray-400">
                  {user ? `${conversionHistory.length} conversions` : 'Sign in required'}
                </span>
              </div>
              
              {!user ? (
                <div className="text-center py-8">
                  <FaHistory className="mx-auto text-4xl text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg">Sign in to view conversion history</p>
                  <p className="text-gray-500 text-sm">Your conversion history will be saved when you're signed in</p>
                </div>
              ) : conversionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FaHistory className="mx-auto text-4xl text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg">No conversion history yet</p>
                  <p className="text-gray-500 text-sm">Start converting currencies to see your history here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conversionHistory.slice(0, 9).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-teal-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-teal-400">
                          {item.from?.toUpperCase()} → {item.to?.toUpperCase()}
                        </span>
                        <FaClock className="text-gray-400 text-xs" />
                      </div>
                      <div className="text-lg font-semibold text-white mb-1">
                        {item.amount} → {item.result?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Rate: 1 {item.from?.toUpperCase()} = {item.rate?.toFixed(6)} {item.to?.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.timestamp instanceof Date ? item.timestamp.toLocaleString() : 
                         item.timestamp?.toDate?.() ? item.timestamp.toDate().toLocaleString() : 'Recently'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CryptoConverter;
