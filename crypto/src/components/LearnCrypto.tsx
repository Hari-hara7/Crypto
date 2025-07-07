import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { db, auth } from "../utils/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { FaHeart, FaEye, FaRocket, FaCheckCircle, FaThumbsUp, FaThumbsDown, FaShareAlt } from "react-icons/fa";
const features = [
  {
    label: "Crypto Fundamentals",
    link: "https://www.coinbase.com/learn/crypto-basics",
  },
  {
    label: "Live Market Analysis",
    link: "https://www.tradingview.com/markets/cryptocurrencies/",
  },
  {
    label: "Beginner to Advanced Tutorials",
    link: "https://www.investopedia.com/cryptocurrency-4427699",
  },
  {
    label: "Blockchain & Security",
    link: "https://ethereum.org/en/developers/docs/security/",
  },
  {
    label: "Daily Learning Challenges",
    link: "https://www.cryptohopper.com/learn/academy",
  },
  {
    label: "Community Discussions",
    link: "https://www.reddit.com/r/CryptoCurrency/",
  },
  {
    label: "Weekly Webinars & AMAs",
    link: "https://cointelegraph.com/webinars",
  },
];

const LearnCryptoLikeAPro = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userVote, setUserVote] = useState<string | null>(null);

  const pageId = "learn-crypto-page";

  useEffect(() => {
    const unsubUser = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      const userId = u?.uid || "guest-" + Math.random();
      const userViewDoc = doc(db, "pages", pageId, "views", userId);
      const voteDoc = await getDoc(doc(db, "pages", pageId, "votes", userId));
      if (voteDoc.exists()) setUserVote(voteDoc.data().vote);

      const docSnap = await getDoc(userViewDoc);
      if (!docSnap.exists()) {
        await setDoc(userViewDoc, {
          viewedAt: serverTimestamp(),
        });
      }

      const pageDocRef = doc(db, "pages", pageId);
      const pageSnap = await getDoc(pageDocRef);
      if (!pageSnap.exists()) {
        await setDoc(pageDocRef, { likes: 0, dislikes: 0, views: 0 });
      }
    });
    return () => unsubUser();
  }, []);

  useEffect(() => {
    const updateMainStats = async () => {
      await updateDoc(doc(db, "pages", pageId), { views: increment(1) });
    };
    updateMainStats();

    const unsubStats = onSnapshot(doc(db, "pages", pageId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
        setViews(data.views || 0);
      }
    });

    const unsubUnique = onSnapshot(collection(db, "pages", pageId, "views"), (snap) => {
      setUniqueViews(snap.size);
    });

    const unsubComments = onSnapshot(collection(db, "pages", pageId, "comments"), (snap) => {
      const fetched: any[] = [];
      snap.forEach((doc) => fetched.push(doc.data()));
      setComments(fetched.reverse());
    });

    return () => {
      unsubStats();
      unsubUnique();
      unsubComments();
    };
  }, []);

  const handleVote = async (type: "like" | "dislike") => {
    if (!user || userVote) return;
    const userId = user.uid;
    const voteRef = doc(db, "pages", pageId, "votes", userId);
    await setDoc(voteRef, { vote: type });
    if (type === "like") {
      await updateDoc(doc(db, "pages", pageId), { likes: increment(1) });
      setUserVote("like");
    } else {
      await updateDoc(doc(db, "pages", pageId), { dislikes: increment(1) });
      setUserVote("dislike");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    await addDoc(collection(db, "pages", pageId, "comments"), {
      user: user?.email || "Anonymous",
      text: comment.trim(),
      createdAt: serverTimestamp()
    });
    setComment("");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    } catch (e) {
      alert("Failed to copy link.");
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen py-10 px-4 sm:px-6 lg:px-20">
      <Card className="bg-gray-900 text-white max-w-5xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-4xl text-blue-400 flex items-center gap-2">
            <FaRocket className="text-blue-500" /> Learn Crypto Like a Pro
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            All-in-one crypto education platform tailored for beginners and enthusiasts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <a href={feature.link} key={i} target="_blank" rel="noopener noreferrer">
                <Badge variant="secondary" className="bg-blue-600/10 border border-blue-400 text-blue-300 text-left px-4 py-2 hover:underline">
                  <FaCheckCircle className="inline mr-2 text-blue-300" /> {feature.label}
                </Badge>
              </a>
            ))}
          </div>

          <Separator className="bg-gray-700 my-6" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-teal-300 text-lg flex items-center gap-1"><FaThumbsUp /> {likes} Upvotes</p>
            <p className="text-red-400 text-lg flex items-center gap-1"><FaThumbsDown /> {dislikes} Downvotes</p>
            <p className="text-blue-300 text-lg flex items-center gap-1"><FaEye /> {views} Total Views</p>
            <p className="text-indigo-300 text-lg flex items-center gap-1"><FaEye /> {uniqueViews} Unique Users</p>
            <div className="flex gap-3">
              <Button variant="default" onClick={() => handleVote("like")}
                disabled={!!userVote} className="bg-blue-500 hover:bg-blue-600">
                <FaThumbsUp className="mr-1" /> Upvote
              </Button>
              <Button variant="ghost" onClick={() => handleVote("dislike")}
                disabled={!!userVote} className="text-red-400 hover:bg-red-500/10">
                <FaThumbsDown className="mr-1" /> Downvote
              </Button>
              <Button className="bg-white text-black"  variant="outline " onClick={handleShare}><FaShareAlt className="mr-1" /> Share </Button>
            </div>
          </div>

          <Separator className="bg-gray-700 my-4" />

          <div>
            <h3 className="text-xl text-blue-300 mb-3">💬 Comments</h3>
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
                  <p className="text-sm text-gray-300 font-semibold">{c.user}</p>
                  <p className="text-gray-200 mt-1">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                className="bg-gray-700 text-white"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleCommentSubmit} className="bg-blue-500 hover:bg-blue-600">Post Comment</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnCryptoLikeAPro;
