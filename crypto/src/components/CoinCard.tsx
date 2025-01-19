import { FC } from "react";
import { motion } from "framer-motion";
import { Coin } from "../services/types";
import { formatCurrency, formatPercentage, formatLargeNumber } from "../utils/formatters";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: FC<CoinCardProps> = ({ coin }) => {
  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 overflow-hidden"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Header: Coin Icon and Name */}
      <div className="flex items-center space-x-4">
        <img src={coin.image} alt={coin.name} className="w-14 h-14 rounded-full border border-gray-700" />
        <div>
          <h2 className="text-lg font-bold text-teal-400">{coin.name}</h2>
          <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>
      
      {/* Content: Coin Details */}
      <div className="mt-4 space-y-3">
        <p>
          <span className="font-semibold text-teal-400">Price: </span>
          {formatCurrency(coin.current_price)}
        </p>
        <p>
          <span className="font-semibold text-teal-400">Market Cap: </span>
          {formatLargeNumber(coin.market_cap)}
        </p>
        <p>
          <span className="font-semibold text-teal-400">24h Change: </span>
          <span
            className={
              coin.price_change_percentage_24h > 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        </p>
        <p>
          <span className="font-semibold text-teal-400">Volume (24h): </span>
          {formatLargeNumber(coin.total_volume)}
        </p>
      </div>
    </motion.div>
  );
};

export default CoinCard;
