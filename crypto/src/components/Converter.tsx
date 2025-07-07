import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import { auth, db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CryptoConverter = () => {
  const [cryptos, setCryptos] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('usd');
  const [user, setUser] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);

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
  }, [fromCurrency, toCurrency, baseCurrency]);

  // Perform conversion and save to Firestore
  useEffect(() => {
    if (conversionRate && amount) {
      const result = amount * conversionRate;
      setConvertedAmount(result);

      if (user) {
        const saveConversion = async () => {
          try {
            await addDoc(collection(db, "users", user.uid, "conversions"), {
              from: fromCurrency,
              to: toCurrency,
              amount: parseFloat(amount),
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
  }, [conversionRate, amount, user]);

  // Fetch user's past conversions
  const fetchConversionHistory = async (uid) => {
    try {
      const q = query(collection(db, "users", uid, "conversions"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversionHistory(data);
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Crypto and Currency Converter</h2>

        {/* Base Currency */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Base Currency:</label>
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
          >
            <option value="usd">USD</option>
            <option value="inr">INR</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
          />
        </div>

        {/* From Crypto */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">From (Crypto):</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Fiat */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">To (Currency):</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-medium mb-2">Converted Amount:</h3>
          {loading ? (
            <FaSpinner className="animate-spin text-green-500 text-3xl" />
          ) : (
            <p className="text-lg">
              {convertedAmount ? `${convertedAmount} ${toCurrency.toUpperCase()}` : 'Enter amount to convert'}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            {conversionRate ? `1 ${fromCurrency} = ${conversionRate} ${toCurrency.toUpperCase()}` : 'Fetching Rate...'}
          </p>
        </div>
      </div>

      {/* Previous Conversions */}
      {user && conversionHistory.length > 0 && (
        <div className="mt-10 w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Previous Conversions</h3>
            <button
              onClick={clearConversionHistory}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Clear History
            </button>
          </div>
          <ul className="space-y-2">
            {conversionHistory.map((item) => (
              <li key={item.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-sm">
                <div>
                  {item.amount} {item.from} ➡ {item.result?.toFixed(2)} {item.to}
                </div>
                <div className="text-gray-400 text-xs">
                  {item.timestamp?.toDate?.().toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CryptoConverter;
