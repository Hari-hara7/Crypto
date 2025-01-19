import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaSpinner } from 'react-icons/fa'; // Import icons

const CryptoConverter = () => {
  const [cryptos, setCryptos] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('usd'); // New state for base currency selection

  // Fetch coins and currency data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch cryptocurrency list
        const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        setCryptos(cryptoRes.data);

        // Fetch supported fiat currencies (including INR, USD, etc.)
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

  // Fetch conversion rate based on base currency
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        setLoading(true);
        if (fromCurrency && toCurrency) {
          // If baseCurrency is set to a fiat currency like USD or INR, use that for conversion.
          const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`);
          setConversionRate(res.data[fromCurrency][toCurrency]);
        }
      } catch (error) {
        console.error('Error fetching conversion rate', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversionRate();
  }, [fromCurrency, toCurrency, baseCurrency]); // Add baseCurrency as a dependency

  // Update converted amount when conversion rate or amount changes
  useEffect(() => {
    if (conversionRate && amount) {
      setConvertedAmount(amount * conversionRate);
    }
  }, [conversionRate, amount]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Crypto and Currency Converter</h2>

        {/* Base Currency Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Base Currency:</label>
          <div className="relative">
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="usd">USD</option>
              <option value="inr">INR</option>
              {/* You can add more base currencies here */}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount:</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <span className="text-green-600">{baseCurrency.toUpperCase()}</span> {/* Display base currency after input */}
          </div>
        </div>

        {/* From Currency Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">From Currency (Crypto):</label>
          <div className="relative">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {cryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
            <FaExchangeAlt className="absolute top-3 right-3 text-gray-400" /> {/* Icon next to dropdown */}
          </div>
        </div>

        {/* To Currency Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">To Currency (Fiat):</label>
          <div className="relative">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <FaExchangeAlt className="absolute top-3 right-3 text-gray-400" /> {/* Icon next to dropdown */}
          </div>
        </div>

        {/* Converted Amount */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-medium mb-2">Converted Amount:</h3>
          {loading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-green-500 text-3xl" />
            </div> // Loading spinner
          ) : (
            <p className="text-lg">
              {convertedAmount ? `${convertedAmount} ${toCurrency.toUpperCase()}` : 'Enter amount to calculate'}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            {conversionRate ? `1 ${fromCurrency} = ${conversionRate} ${toCurrency.toUpperCase()}` : 'Fetching Rate...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoConverter;
