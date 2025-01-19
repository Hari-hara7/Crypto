import { FC } from "react";
import { Coin } from "../services/types";
import { formatCurrency, formatPercentage, formatLargeNumber } from "../utils/formatters";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: FC<CoinCardProps> = ({ coin }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <img src={coin.image} alt={coin.name} className="w-12 h-12" />
        <div>
          <h2 className="text-lg font-semibold">{coin.name}</h2>
          <p className="text-sm text-gray-500 uppercase">{coin.symbol}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p>
          <span className="font-medium">Price: </span>
          {formatCurrency(coin.current_price)}
        </p>
        <p>
          <span className="font-medium">Market Cap: </span>
          {formatLargeNumber(coin.market_cap)}
        </p>
        <p>
          <span className="font-medium">24h Change: </span>
          <span
            className={
              coin.price_change_percentage_24h > 0
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        </p>
        <p>
          <span className="font-medium">Volume (24h): </span>
          {formatLargeNumber(coin.total_volume)}
        </p>
      </div>
    </div>
  );
};

export default CoinCard;
