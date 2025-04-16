import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaBitcoin, FaEthereum, FaChartLine, FaSave } from "react-icons/fa";

// API URL for CoinGecko
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=";

type PortfolioCoin = {
  name: string;
  amount: number;
  risk: string;
};

const Portfolio: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [portfolio, setPortfolio] = useState<PortfolioCoin[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [newCoin, setNewCoin] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPortfolio(currentUser);
      } else {
        window.location.href = "/login"; // Redirect to login if not authenticated
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchPortfolio = async (currentUser: any) => {
    const userRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setPortfolio(docSnap.data().portfolio || []);
    }
  };

  const handleAddCoin = () => {
    if (!newCoin || newAmount <= 0) return;

    const updatedPortfolio = [
      ...portfolio,
      { name: newCoin, amount: newAmount, risk: "Medium" },
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
          total += coinData.usd * coin.amount;

          let risk = "Medium";
          const marketCap = coinData.market_cap;
          if (marketCap > 10000000000) risk = "Low";
          else if (marketCap < 1000000000) risk = "High";

          return { ...coin, risk };
        }
        return coin;
      });

      setPortfolio(updatedPortfolio);
      setTotalValue(total);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center">
      <div className="portfolio-container p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="text-right mb-2">
          <p className="text-sm text-gray-400">Logged in as <span className="font-semibold">{user?.email}</span></p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Crypto Portfolio Tracker</h2>

        <div className="form-group mb-4">
          <label htmlFor="coin" className="block text-lg mb-2">Add Coin to Portfolio:</label>
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
              <FaSave className="inline-block mr-1" /> Add
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
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span>{coin.name}</span>
                  <span>{coin.amount} {coin.name}</span>
                  <span
                    className={`font-semibold ${
                      coin.risk === "Low"
                        ? "text-green-500"
                        : coin.risk === "High"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
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
            <FaChartLine className="inline-block mr-2" /> Calculate Value
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-4">Calculating...</div>
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
