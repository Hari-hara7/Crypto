import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
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
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 },
        });
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();
  }, []);

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

  const formatTimestamp = (ts: Timestamp | { seconds: number }) => {
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <ScrollArea className="h-screen p-6 bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🔥 Crypto Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {coins.map((coin) => (
          <Card key={coin.id} className="bg-gray-800 hover:shadow-xl transition-all">
            <CardHeader className="cursor-pointer" onClick={() => handleCoinClick(coin.id)}>
              <CardTitle className="text-yellow-300 flex justify-between items-center">
                {coin.name}
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Symbol: {coin.symbol.toUpperCase()}</p>
              <p>Price: ${coin.current_price.toFixed(2)}</p>
              {user && (
                <Button
                  variant="secondary"
                  className="mt-3 bg-yellow-500 text-black hover:bg-yellow-600"
                  onClick={() => handleAddFavorite(coin)}
                >
                  Add to Favorites
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {user && favorites.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl text-green-400 mb-4">⭐ Your Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((coin) => (
              <Card key={coin.id} className="bg-gray-900">
                <CardHeader className="flex justify-between items-center">
                  <span className="text-yellow-300">{coin.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFavorite(coin)}
                  >
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="text-sm text-gray-400">
                  <p>Symbol: {coin.symbol.toUpperCase()}</p>
                  <p>Price: ${coin.current_price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedCoin && (
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400">{selectedCoin.name} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <img src={selectedCoin.image.large} alt={selectedCoin.name} className="w-20 h-20" />
            <p>Symbol: <span className="text-yellow-300">{selectedCoin.symbol.toUpperCase()}</span></p>
            <p>Current Price: <span className="text-yellow-300">${selectedCoin.market_data.current_price.usd.toFixed(2)}</span></p>
            <p>Market Cap: <span className="text-yellow-300">${selectedCoin.market_data.market_cap.usd.toLocaleString()}</span></p>
            <p>24h Change: <span className={selectedCoin.market_data.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}>
              {selectedCoin.market_data.price_change_percentage_24h.toFixed(2)}%</span></p>
            <p>Total Volume: <span className="text-yellow-300">${selectedCoin.market_data.total_volume.usd.toLocaleString()}</span></p>

            <Separator className="my-4" />
            <h3 className="text-lg font-semibold text-yellow-400">📘 About {selectedCoin.name}</h3>
            <p className="text-sm text-gray-300">
              {selectedCoin.description.en
                ? selectedCoin.description.en.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 500) + "..."
                : "No description available for this coin."}
            </p>

            <Separator className="my-4" />
            <Textarea
              className="text-white"
              placeholder="Leave a comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <Button className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={handleAddComment}>Submit Comment</Button>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold text-yellow-400">Recent Comments</h3>
            <ul className="text-sm space-y-2">
              {comments.map((c, i) => (
                <li key={i}>
                  <span className="text-green-400">{c.user}</span>: {c.message}
                  <div className="text-xs text-gray-400">{formatTimestamp(c.createdAt)}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </ScrollArea>
  );
};

export default CoinList;