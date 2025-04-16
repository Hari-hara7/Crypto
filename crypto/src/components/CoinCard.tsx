import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coin } from "../services/types";
import { formatCurrency, formatPercentage, formatLargeNumber } from "../utils/formatters";
import { db, auth } from "../utils/firebaseConfig";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: FC<CoinCardProps> = ({ coin }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "watchlists", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWatchlist(data.coins || []);
        setIsInWatchlist(data.coins?.includes(coin.id));
      }
    });

    return () => unsubscribe();
  }, [coin.id, user]);

  const toggleWatchlist = async () => {
    if (!user) return alert("Sign in to manage your watchlist");

    const ref = doc(db, "watchlists", user.uid);
    const updatedCoins = isInWatchlist
      ? arrayRemove(coin.id)
      : arrayUnion(coin.id);

    await setDoc(
      ref,
      { coins: updatedCoins },
      { merge: true }
    );
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 overflow-hidden"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Border Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

      {/* Star Button */}
      <button
        onClick={toggleWatchlist}
        className="absolute top-3 right-3 text-yellow-400 text-xl z-10"
        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        {isInWatchlist ? <AiFillStar /> : <AiOutlineStar />}
      </button>

      {/* Coin Info */}
      <div className="flex items-center space-x-4">
        <img src={coin.image} alt={coin.name} className="w-14 h-14 rounded-full border border-gray-700" />
        <div>
          <h2 className="text-lg font-bold text-teal-400">{coin.name}</h2>
          <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 space-y-3">
        <p><span className="font-semibold text-teal-400">Price: </span>{formatCurrency(coin.current_price)}</p>
        <p><span className="font-semibold text-teal-400">Market Cap: </span>{formatLargeNumber(coin.market_cap)}</p>
        <p>
          <span className="font-semibold text-teal-400">24h Change: </span>
          <span className={coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}>
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        </p>
        <p><span className="font-semibold text-teal-400">Volume (24h): </span>{formatLargeNumber(coin.total_volume)}</p>
      </div>
    </motion.div>
  );
};

export default CoinCard;
