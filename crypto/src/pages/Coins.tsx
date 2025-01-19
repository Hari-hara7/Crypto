import { FC, useState, useEffect } from "react";
import { fetchCoins } from "../services/api";
import { Coin } from "../services/types";
import CoinCard from "../components/CoinCard";
import FilterBar from "../components/FilterBar";
import HistoricalChart from "../components/HistoricalChart";

const Coins: FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin"); // Default selected coin
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrencies</h1>
      
      {/* Filter Bar */}
      <FilterBar onSortChange={handleSortChange} onFilterChange={handleFilterChange} />

      {/* Coin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCoins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            onClick={() => handleCoinSelection(coin.id)} // Select coin for historical data
          />
        ))}
      </div>

      {/* Historical Data Chart */}
      {selectedCoin && !loading && (
        <HistoricalChart cryptoId={selectedCoin} />
      )}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Coins;
