import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { 
  FaEye, 
  FaThumbsUp, 
  FaShareAlt,
  FaPlay,
  FaClock,
  FaUsers,
  FaBookmark,
  FaSearch,
  FaFilter,
  FaStar,
  FaGraduationCap,
  FaTrophy,
  FaExternalLinkAlt,
  FaShieldAlt
} from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

interface Comment {
  user: string;
  text: string;
  createdAt: Date | null;
}

interface User {
  uid: string;
  email?: string | null;
}
const learningCategories = [
  {
    category: "Beginner Basics",
    icon: <FaGraduationCap />,
    color: "bg-green-500/20 border-green-400 text-green-300",
    courses: [
      {
        title: "What is Cryptocurrency?",
        description: "Learn the fundamentals of digital currencies",
        duration: "15 min",
        difficulty: "Beginner",
        link: "https://www.coinbase.com/learn/crypto-basics/what-is-cryptocurrency",
        completions: 1250
      },
      {
        title: "How Blockchain Works",
        description: "Understanding the technology behind crypto",
        duration: "25 min",
        difficulty: "Beginner",
        link: "https://www.investopedia.com/terms/b/blockchain.asp",
        completions: 980
      },
      {
        title: "Setting Up Your First Wallet",
        description: "Secure storage for your digital assets",
        duration: "20 min",
        difficulty: "Beginner",
        link: "https://ethereum.org/en/wallets/",
        completions: 850
      }
    ]
  },
  {
    category: "Trading & Analysis",
    icon: <FiTrendingUp />,
    color: "bg-blue-500/20 border-blue-400 text-blue-300",
    courses: [
      {
        title: "Technical Analysis Basics",
        description: "Chart patterns and trading indicators",
        duration: "45 min",
        difficulty: "Intermediate",
        link: "https://www.tradingview.com/markets/cryptocurrencies/",
        completions: 750
      },
      {
        title: "Risk Management Strategies",
        description: "Protect your investments with smart strategies",
        duration: "30 min",
        difficulty: "Intermediate",
        link: "https://academy.binance.com/en/articles/risk-management",
        completions: 620
      },
      {
        title: "DeFi Trading Guide",
        description: "Decentralized finance trading fundamentals",
        duration: "40 min",
        difficulty: "Advanced",
        link: "https://defipulse.com/defi-list",
        completions: 480
      }
    ]
  },
  {
    category: "Advanced Topics",
    icon: <FaTrophy />,
    color: "bg-purple-500/20 border-purple-400 text-purple-300",
    courses: [
      {
        title: "Smart Contract Development",
        description: "Build and deploy smart contracts",
        duration: "120 min",
        difficulty: "Advanced",
        link: "https://ethereum.org/en/developers/docs/smart-contracts/",
        completions: 320
      },
      {
        title: "NFT Creation & Trading",
        description: "Non-fungible tokens explained",
        duration: "60 min",
        difficulty: "Advanced",
        link: "https://opensea.io/learn",
        completions: 540
      },
      {
        title: "Yield Farming Strategies",
        description: "Maximize returns through DeFi protocols",
        duration: "50 min",
        difficulty: "Advanced",
        link: "https://academy.binance.com/en/articles/what-is-yield-farming-in-decentralized-finance-defi",
        completions: 380
      }
    ]
  },
  {
    category: "Security & Best Practices",
    icon: <FaShieldAlt />,
    color: "bg-red-500/20 border-red-400 text-red-300",
    courses: [
      {
        title: "Crypto Security Fundamentals",
        description: "Protect yourself from scams and hacks",
        duration: "35 min",
        difficulty: "Beginner",
        link: "https://ethereum.org/en/developers/docs/security/",
        completions: 920
      },
      {
        title: "Hardware Wallet Setup",
        description: "Cold storage for maximum security",
        duration: "25 min",
        difficulty: "Intermediate",
        link: "https://www.ledger.com/academy",
        completions: 680
      },
      {
        title: "Identifying Common Scams",
        description: "Stay safe in the crypto space",
        duration: "20 min",
        difficulty: "Beginner",
        link: "https://support.coinbase.com/customer/portal/articles/2974688",
        completions: 1100
      }
    ]
  }
];

const LearnCryptoLikeAPro = () => {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);

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
        await setDoc(pageDocRef, { likes: 0, views: 0 });
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
        setViews(data.views || 0);
      }
    });

    const unsubUnique = onSnapshot(collection(db, "pages", pageId, "views"), (snap) => {
      setUniqueViews(snap.size);
    });

    const unsubComments = onSnapshot(collection(db, "pages", pageId, "comments"), (snap) => {
      const fetched: Comment[] = [];
      snap.forEach((doc) => fetched.push(doc.data() as Comment));
      setComments(fetched.reverse());
    });

    return () => {
      unsubStats();
      unsubUnique();
      unsubComments();
    };
  }, []);

  const handleVote = async (type: "like") => {
    if (!user || userVote) return;
    const userId = user.uid;
    const voteRef = doc(db, "pages", pageId, "votes", userId);
    await setDoc(voteRef, { vote: type });
    if (type === "like") {
      await updateDoc(doc(db, "pages", pageId), { likes: increment(1) });
      setUserVote("like");
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
    } catch {
      alert("Failed to copy link.");
    }
  };

  const toggleBookmark = (courseTitle: string) => {
    setBookmarkedCourses(prev => 
      prev.includes(courseTitle) 
        ? prev.filter(title => title !== courseTitle)
        : [...prev, courseTitle]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-400';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  const filteredCategories = learningCategories.filter(category =>
    selectedCategory === 'all' || category.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 backdrop-blur-sm border-b border-gray-700"
      >
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-3 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3 mb-6">
                <FaGraduationCap className="text-blue-400 text-xl" />
                <span className="text-blue-300 font-medium">Learn Crypto Academy</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent"
            >
              Master Cryptocurrency
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              From absolute beginner to crypto expert. Learn at your own pace with our comprehensive courses, 
              expert insights, and hands-on tutorials.
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
                  <FaThumbsUp />
                  <span className="text-2xl font-bold">{likes}</span>
                </div>
                <p className="text-gray-400 text-sm">Upvotes</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
                  <FaEye />
                  <span className="text-2xl font-bold">{views}</span>
                </div>
                <p className="text-gray-400 text-sm">Total Views</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-purple-400 mb-2">
                  <FaUsers />
                  <span className="text-2xl font-bold">{uniqueViews}</span>
                </div>
                <p className="text-gray-400 text-sm">Students</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-orange-400 mb-2">
                  <FaTrophy />
                  <span className="text-2xl font-bold">10+</span>
                </div>
                <p className="text-gray-400 text-sm">Courses</p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button 
                onClick={() => handleVote("like")}
                disabled={!!userVote}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                <FaThumbsUp className="mr-2" />
                {userVote === 'like' ? 'Thanks for voting!' : 'Upvote Course'}
              </Button>
              <Button 
                
                onClick={handleShare}
                className="border-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                <FaShareAlt className="mr-2" />
                Share Course
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {learningCategories.map((category) => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Learning Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                  <p className="text-gray-400">{category.courses.length} courses available</p>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course, courseIndex) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (courseIndex * 0.05) }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 group"
                  >
                    <div className="p-6">
                      {/* Course Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleBookmark(course.title)}
                          className="ml-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FaBookmark 
                            className={`${bookmarkedCourses.includes(course.title) 
                              ? 'text-yellow-400' 
                              : 'text-gray-400 hover:text-yellow-400'
                            } transition-colors`}
                          />
                        </button>
                      </div>

                      {/* Course Metadata */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <FaClock />
                          <span>{course.duration}</span>
                        </div>
                        <Badge className={`${getDifficultyColor(course.difficulty)} text-xs`}>
                          {course.difficulty}
                        </Badge>
                      </div>

                      {/* Completions */}
                      <div className="flex items-center space-x-2 mb-6 text-sm text-gray-400">
                        <FaUsers />
                        <span>{course.completions.toLocaleString()} students completed</span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <FaStar className="text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group">
                          <FaPlay className="mr-2 group-hover:scale-110 transition-transform" />
                          Start Learning
                          <FaExternalLinkAlt className="ml-2 text-xs" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FaUsers className="text-blue-400" />
                <span>Community Discussion</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Share your thoughts and connect with fellow learners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Form */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your learning experience or ask questions..."
                  className="bg-gray-700 border-gray-600 text-white resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleCommentSubmit}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Comments List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  Recent Comments ({comments.length})
                </h4>
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FaUsers className="mx-auto text-4xl mb-4 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.slice(0, 10).map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-700/50 p-4 rounded-xl border border-gray-600"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {c.user.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-blue-400">{c.user}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Just now</span>
                        </div>
                        <p className="text-gray-200 leading-relaxed">{c.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LearnCryptoLikeAPro;
