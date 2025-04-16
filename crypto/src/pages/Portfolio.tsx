// Import necessary libraries
import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaBitcoin, FaEthereum, FaChartLine, FaSave } from "react-icons/fa";

// API URL for CoinGecko
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=";

// Types for user portfolio
type PortfolioCoin = {
  name: string;
  amount: number;
  risk: string;
};

const Portfolio: React.FC = () => {
  const [user, setUser] = useState<any>(auth.currentUser);
  const [portfolio, setPortfolio] = useState<PortfolioCoin[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [newCoin, setNewCoin] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>(0);

  useEffect(() => {
    // Fetch portfolio data from Firestore when user is available
    const fetchPortfolio = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setPortfolio(docSnap.data().portfolio || []);
        }
      }
    };

    if (user) fetchPortfolio();
  }, [user]);

  const handleAddCoin = () => {
    if (!newCoin || newAmount <= 0) return;

    const updatedPortfolio = [
      ...portfolio,
      { name: newCoin, amount: newAmount, risk: "Medium" }, // Default risk is Medium
    ];
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
    setNewCoin("");
    setNewAmount(0);
  };

  const savePortfolio = async (updatedPortfolio: PortfolioCoin[]) => {
    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { portfolio: updatedPortfolio }, { merge: true });
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const calculatePortfolioValue = async () => {
    setLoading(true);

    const coinIds = portfolio.map((coin) => coin.name.toLowerCase()).join(",");
    try {
      const response = await fetch(`${COINGECKO_API_URL}${coinIds}&vs_currencies=usd&include_market_cap=true`);
      const data = await response.json();

      let total = 0;
      const updatedPortfolio = portfolio.map((coin) => {
        const coinData = data[coin.name.toLowerCase()];
        if (coinData) {
          // Calculate the total value of the portfolio
          total += coinData.usd * coin.amount;

          // Risk categorization based on market cap
          let risk = "Medium"; // Default risk is Medium
          const marketCap = coinData.market_cap;

          if (marketCap > 10000000000) {
            risk = "Low"; // Low risk for large market caps (e.g., Bitcoin, Ethereum)
          } else if (marketCap < 1000000000) {
            risk = "High"; // High risk for smaller market caps (e.g., Altcoins)
          }

          return { ...coin, risk };
        }
        return coin;
      });

      setPortfolio(updatedPortfolio); // Update portfolio with risk
      setTotalValue(total);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center">
      <div className="portfolio-container p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Crypto Portfolio Tracker</h2>

        <div className="form-group mb-4">
          <label htmlFor="coin" className="block text-lg mb-2">
            Add Coin to Portfolio:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="coin"
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value.toUpperCase())}
              className="p-3 bg-gray-700 text-white rounded-lg w-1/2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Coin Name (BTC, ETH)"
            />
            <input
              type="number"
              id="amount"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="p-3 bg-gray-700 text-white rounded-lg w-1/2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Amount"
            />
            <button
              onClick={handleAddCoin}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <FaSave className="mr-2" /> Add Coin
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Your Portfolio:</h3>
        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          {portfolio.length === 0 ? (
            <p>No coins in your portfolio yet. Add some!</p>
          ) : (
            <ul>
              {portfolio.map((coin, index) => (
                <li key={index} className="flex justify-between items-center py-2">
                  <span>{coin.name}</span>
                  <span>{coin.amount} {coin.name}</span>
                  <span className={`text-${coin.risk === "Low" ? "green" : coin.risk === "High" ? "red" : "yellow"}-500`}>
                    ({coin.risk})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={calculatePortfolioValue}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            <FaChartLine className="mr-2" /> Calculate Portfolio Value
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-4">Loading portfolio value...</div>
        ) : (
          <div className="text-center mt-4">
            <h4 className="text-lg font-semibold">Total Portfolio Value:</h4>
            <p className="text-xl">${totalValue.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
