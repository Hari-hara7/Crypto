
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { auth, db } from "../utils/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  FaStar, 
  FaRegStar, 
  FaArrowUp, 
  FaArrowDown,
  FaComments,
  FaExternalLinkAlt,
  FaChartLine,
  FaWallet,
  FaFire,
  FaChartBar
} from "react-icons/fa";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CoinDetails {
  id: string;
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
  };
}

interface Comment {
  user: string;
  message: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
}

const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinDetails | null>(null);
  const [favorites, setFavorites] = useState<Coin[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [loading, setLoading] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        await setDoc(userDoc, { favorites: [] }, { merge: true });
        const userSnap = await getDoc(userDoc);
        const data = userSnap.data();
        if (data?.favorites) setFavorites(data.favorites);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: { 
            vs_currency: "usd", 
            order: `${sortBy}_desc`, 
            per_page: 20, 
            page: 1,
            sparkline: false,
            price_change_percentage: "24h"
          },
        });
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [sortBy]);

  const handleCoinClick = async (coinId: string) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
      setSelectedCoin(response.data);

      if (user) {
        const commentsRef = collection(db, "coins", coinId, "comments");
        const commentsSnap = await getDocs(query(commentsRef, orderBy("createdAt", "desc"), limit(10)));
        setComments(commentsSnap.docs.map(doc => doc.data() as Comment));
      }
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  const handleAddFavorite = async (coin: Coin) => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      favorites: arrayUnion(coin),
    });
    setFavorites(prev => [...prev, coin]);
  };

  const handleRemoveFavorite = async (coin: Coin) => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      favorites: arrayRemove(coin),
    });
    setFavorites(prev => prev.filter(c => c.id !== coin.id));
  };

  const handleAddComment = async () => {
    if (!user || !selectedCoin || !commentInput.trim()) return;
    const commentRef = collection(db, "coins", selectedCoin.id, "comments");
    const newComment = {
      user: user.email!,
      message: commentInput,
      createdAt: serverTimestamp()
    };
    await addDoc(commentRef, newComment);

    setComments(prev => [
      {
        user: user.email!,
        message: commentInput,
        createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      },
      ...prev
    ]);
    setCommentInput("");
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: { 
          vs_currency: "usd", 
          order: `${sortBy}_desc`, 
          per_page: 20, 
          page: 1,
          sparkline: false,
          price_change_percentage: "24h"
        },
      });
      setCoins(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = showOnlyFavorites ? favorites.some(fav => fav.id === coin.id) : true;
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 h-full w-full z-0"
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 drop-shadow-lg mb-6">
              <FaFire className="inline-block mr-3 text-teal-400" />
              Crypto Tracker Pro
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              Track, analyze, and discover the latest cryptocurrency trends with real-time data and advanced features.
            </p>

            {/* Search and Filter Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:outline-none w-64"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:outline-none"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price">Price</option>
                <option value="total_volume">Volume</option>
                <option value="price_change_percentage_24h">24h Change</option>
              </select>

              <Button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                variant={showOnlyFavorites ? "default" : "secondary"}
                className={`${showOnlyFavorites 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                  : 'bg-gray-800 text-teal-400 hover:bg-gray-700'
                }`}
              >
                <FaStar className="mr-2" />
                {showOnlyFavorites ? 'Show All' : 'Favorites Only'}
              </Button>

              <Button
                onClick={refreshData}
                disabled={loading}
                className="bg-gray-800 text-teal-400 hover:bg-gray-700"
              >
                <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Market Overview Cards */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center text-teal-400 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Market Overview
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <MarketStatCard
                icon={<FaChartLine className="text-teal-400 text-4xl" />}
                title="Total Coins"
                value={filteredCoins.length.toString()}
                subtitle="Active Cryptocurrencies"
              />
              <MarketStatCard
                icon={<FaChartBar className="text-green-400 text-4xl" />}
                title="Trending"
                value={filteredCoins.filter(coin => coin.price_change_percentage_24h > 0).length.toString()}
                subtitle="Coins in Green"
              />
              <MarketStatCard
                icon={<FaWallet className="text-yellow-400 text-4xl" />}
                title="Favorites"
                value={favorites.length.toString()}
                subtitle="Your Watchlist"
              />
            </div>
          </div>
        </section>

        {/* Main Coin Grid */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCoins.map((coin, index) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    index={index}
                    isFavorite={favorites.some(fav => fav.id === coin.id)}
                    onCoinClick={handleCoinClick}
                    onAddFavorite={handleAddFavorite}
                    onRemoveFavorite={handleRemoveFavorite}
                    user={user}
                  />
                ))}
              </div>
            )}

            {filteredCoins.length === 0 && !loading && (
              <div className="text-center py-20">
                <FiSearch className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No cryptocurrencies found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>

        {/* Selected Coin Details Modal */}
        {selectedCoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCoin(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CoinDetailsModal
                coin={selectedCoin}
                comments={comments}
                commentInput={commentInput}
                setCommentInput={setCommentInput}
                handleAddComment={handleAddComment}
                onClose={() => setSelectedCoin(null)}
                user={user}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Market Stat Card Component
const MarketStatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}> = ({ icon, title, value, subtitle }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-teal-400 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div>{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-teal-400 mb-2">{value}</div>
    <div className="text-sm text-gray-400">{subtitle}</div>
  </motion.div>
);

// Coin Card Component
const CoinCard: React.FC<{
  coin: Coin;
  index: number;
  isFavorite: boolean;
  onCoinClick: (coinId: string) => void;
  onAddFavorite: (coin: Coin) => void;
  onRemoveFavorite: (coin: Coin) => void;
  user: User | null;
}> = ({ coin, index, isFavorite, onCoinClick, onAddFavorite, onRemoveFavorite, user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-teal-400 transition-all duration-300 cursor-pointer"
    onClick={() => onCoinClick(coin.id)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold text-white">{coin.name}</h3>
          <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>
      {user && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorite) {
              onRemoveFavorite(coin);
            } else {
              onAddFavorite(coin);
            }
          }}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </button>
      )}
    </div>

    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-teal-400">
          ${coin.current_price.toFixed(coin.current_price < 1 ? 6 : 2)}
        </span>
        <div className={`flex items-center space-x-1 ${
          coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {coin.price_change_percentage_24h >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          <span className="font-medium">
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p className="text-white font-medium">
            ${(coin.market_cap / 1e9).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className="text-gray-400">Volume</p>
          <p className="text-white font-medium">
            ${(coin.total_volume / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Coin Details Modal Component
const CoinDetailsModal: React.FC<{
  coin: CoinDetails;
  comments: Comment[];
  commentInput: string;
  setCommentInput: (value: string) => void;
  handleAddComment: () => void;
  onClose: () => void;
  user: User | null;
}> = ({ coin, comments, commentInput, setCommentInput, handleAddComment, onClose, user }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-white">{coin.name}</h2>
          <p className="text-lg text-gray-400">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white text-2xl"
      >
        ×
      </button>
    </div>

    {/* Price Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Current Price</p>
        <p className="text-2xl font-bold text-teal-400">
          ${coin.market_data.current_price.usd.toFixed(2)}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Market Cap</p>
        <p className="text-xl font-semibold text-white">
          ${(coin.market_data.market_cap.usd / 1e9).toFixed(2)}B
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">24h Change</p>
        <p className={`text-xl font-semibold ${
          coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {coin.market_data.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Volume</p>
        <p className="text-xl font-semibold text-white">
          ${(coin.market_data.total_volume.usd / 1e6).toFixed(2)}M
        </p>
      </div>
    </div>

    {/* Description */}
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
        <FaChartLine className="mr-2" />
        About {coin.name}
      </h3>
      <p className="text-gray-300 leading-relaxed">
        {coin.description.en
          ? coin.description.en.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 500) + "..."
          : "No description available for this cryptocurrency."}
      </p>
      {coin.links.homepage[0] && (
        <a
          href={coin.links.homepage[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 text-teal-400 hover:text-teal-300 transition-colors"
        >
          <FaExternalLinkAlt className="mr-2" />
          Visit Website
        </a>
      )}
    </div>

    {/* Comments Section */}
    {user && (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
          <FaComments className="mr-2" />
          Community Discussion
        </h3>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts about this cryptocurrency..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 resize-none"
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            disabled={!commentInput.trim()}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
          >
            Post Comment
          </Button>
        </div>

        <Separator className="my-6 bg-gray-600" />

        <div className="space-y-4 max-h-64 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-400 font-medium">{comment.user}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{comment.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    )}
  </div>
);

export default CoinList;
