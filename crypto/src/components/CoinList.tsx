import React, { useState, useEffect } from "react";
import axios from "axios";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface CoinDetails {
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    total_volume: {
      usd: number;
    };
  };
  links: {
    homepage: string[];
    twitter: string;
    reddit: string;
  };
}

const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
            },
          }
        );
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleCoinClick = async (coinId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      setSelectedCoin(response.data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">Crypto Tracker</h1>
      {loading && <div className="text-yellow-400 text-lg">Loading...</div>}
      
      {/* Coin List */}
      <div className="flex flex-wrap justify-center gap-6">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer w-64"
            onClick={() => handleCoinClick(coin.id)}
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="w-16 h-16 mx-auto rounded-full"
            />
            <h3 className="text-xl font-semibold text-center mt-4">
              {coin.name}
            </h3>
            <p className="text-center text-gray-400">
              {coin.symbol.toUpperCase()}
            </p>
            <p className="text-center text-yellow-400 mt-2">
              ${coin.current_price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Coin Details */}
      {selectedCoin && (
        <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            {selectedCoin.name}
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={selectedCoin.image.large}
              alt={selectedCoin.name}
              className="w-32 h-32 rounded-full mb-4 md:mr-6"
            />
            <div className="text-gray-300">
              <p>
                Symbol:{" "}
                <span className="text-yellow-400">
                  {selectedCoin.symbol.toUpperCase()}
                </span>
              </p>
              <p>
                Current Price:{" "}
                <span className="text-yellow-400">
                  ${selectedCoin.market_data.current_price.usd.toFixed(2)}
                </span>
              </p>
              <p>
                Market Cap:{" "}
                <span className="text-yellow-400">
                  ${selectedCoin.market_data.market_cap.usd.toLocaleString()}
                </span>
              </p>
              <p>
                24h Change:{" "}
                <span
                  className={`${
                    selectedCoin.market_data.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedCoin.market_data.price_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </span>
              </p>
              <p>
                Total Volume:{" "}
                <span className="text-yellow-400">
                  ${selectedCoin.market_data.total_volume.usd.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Description:</h3>
            <p className="text-gray-300">
              {selectedCoin.description.en || "No description available."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Links:</h3>
            <ul className="text-gray-300">
              {selectedCoin.links.homepage[0] && (
                <li>
                  <a
                    href={selectedCoin.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:underline"
                  >
                    Homepage
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinList;
