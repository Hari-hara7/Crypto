import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { 
  FaPaperPlane, 
  FaBitcoin, 
  FaArrowUp, 
  FaComment,
  FaCalendarAlt,
  FaHeart,
  FaShare,
  FaEllipsisV,
  FaGoogle,
  FaSearch,
  FaFilter,
  FaBookmark,
  FaImage,
  FaVideo,
  FaLink,
  FaHashtag,
  FaFire,
  FaEye,
  FaFlag,
  FaCopy,
  FaWhatsapp,
  FaTwitter,
  FaTelegram
} from "react-icons/fa";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// TypeScript interfaces
interface Comment {
  text: string;
  author: {
    name: string;
    photoURL: string;
  };
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    photoURL: string;
  };
  createdAt: string;
  likes: number;
  upvotes: number;
  likedBy: string[];
  upvotedBy: string[];
  comments: Comment[];
}

const CryptoPost: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [filterCategory, setFilterCategory] = useState<'all' | 'news' | 'analysis' | 'tips'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [viewedPosts, setViewedPosts] = useState<Set<string>>(new Set());
  const [postMenuOpen, setPostMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isGoogleUser = user?.providerData[0]?.providerId === "google.com";
    setShowAlert(!isGoogleUser);
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "crypto_posts"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsArray: Post[] = [];
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(postsArray);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill in both title and content.");
      return;
    }

    try {
      await addDoc(collection(db, "crypto_posts"), {
        title,
        content,
        author: {
          name: user?.displayName || "Anonymous",
          email: user?.email,
          photoURL: user?.photoURL || "default-avatar-url.jpg",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        upvotes: 0,
        likedBy: [],
        upvotedBy: [],
        comments: [],
      });

      setTitle("");
      setContent("");
      toast.success("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("An error occurred while submitting the post.");
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("You must be signed in to like posts.");
      return;
    }

    const postRef = doc(db, "crypto_posts", postId);
    const post = posts.find((post) => post.id === postId);

    if (!post) return;

    if (post.likedBy?.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: (post.likes || 0) - 1,
        likedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: (post.likes || 0) + 1,
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!user) {
      toast.error("You must be signed in to upvote posts.");
      return;
    }

    const postRef = doc(db, "crypto_posts", postId);
    const post = posts.find((post) => post.id === postId);

    if (!post) return;

    if (post.upvotedBy?.includes(user.uid)) {
      await updateDoc(postRef, {
        upvotes: (post.upvotes || 0) - 1,
        upvotedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        upvotes: (post.upvotes || 0) + 1,
        upvotedBy: arrayUnion(user.uid),
      });
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!user) {
      toast.error("You must be signed in to comment on posts.");
      return;
    }

    if (!commentText[postId]?.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const postRef = doc(db, "crypto_posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        text: commentText[postId],
        author: {
          name: user.displayName || "Anonymous",
          photoURL: user.photoURL || "default-avatar-url.jpg",
        },
        createdAt: new Date().toISOString(),
      }),
    });

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment added!");
  };

  // Utility functions for new features
  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    toast.success(bookmarkedPosts.includes(postId) ? "Bookmark removed" : "Post bookmarked!");
  };

  const handleShare = (postId: string, platform?: string) => {
    if (platform) {
      const post = posts.find(p => p.id === postId);
      const url = `${window.location.origin}/post/${postId}`;
      const text = `Check out this crypto post: "${post?.title}"`;
      
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
          break;
        case 'copy':
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          break;
      }
      setShowShareModal(null);
    } else {
      setShowShareModal(postId);
    }
  };

  const markAsViewed = (postId: string) => {
    setViewedPosts(prev => new Set([...prev, postId]));
  };

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || 
                            post.title.toLowerCase().includes(filterCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.upvotes) - (a.likes + a.upvotes);
        case 'trending':
          return b.comments.length - a.comments.length;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151'
          }
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            <FaBitcoin className="inline-block mr-4 text-yellow-400 animate-pulse" />
            Crypto Community
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Share insights, discuss trends, and connect with fellow crypto enthusiasts
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, topics, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/80 backdrop-blur-sm text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  showFilters 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "bg-gray-700/50 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-600"
                }`}
              >
                <FaFilter />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'trending')}
                className="px-4 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="newest">Latest</option>
                <option value="popular">Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap gap-3">
                  <span className="text-gray-300 font-medium">Categories:</span>
                  {['all', 'news', 'analysis', 'tips'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category as 'all' | 'news' | 'analysis' | 'tips')}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                        filterCategory === category
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                          : "bg-gray-700/50 text-gray-300 hover:bg-teal-500/10 hover:text-teal-400 border border-gray-600"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Alert Banner */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 mb-8 rounded-2xl shadow-2xl border border-red-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <FaGoogle className="text-2xl mr-4" />
                <div>
                  <h3 className="font-bold text-lg">Google Sign-In Required</h3>
                  <p className="text-red-100">Please sign in with Google to create and interact with crypto posts.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Creation Form */}
        {user && !showAlert && (
          <motion.div
            className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaPaperPlane className="mr-3 text-blue-400" />
              Create New Post
              <span className="ml-auto text-sm font-normal text-gray-400">
                {content.length}/1000 characters
              </span>
            </h2>
            
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-lg font-semibold text-gray-200">
                  Post Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-gray-700/80 backdrop-blur-sm text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="What's on your mind about crypto?"
                  maxLength={100}
                />
                <div className="text-xs text-gray-400">{title.length}/100 characters</div>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="block text-lg font-semibold text-gray-200">
                  Share Your Thoughts
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 bg-gray-700/80 backdrop-blur-sm text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows={6}
                  placeholder="Share your crypto insights, market analysis, or trading tips..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button type="button" className="text-gray-400 hover:text-blue-400 transition-colors" title="Add Image">
                      <FaImage />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-blue-400 transition-colors" title="Add Video">
                      <FaVideo />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-blue-400 transition-colors" title="Add Link">
                      <FaLink />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">{content.length}/1000 characters</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">Post will be public</span>
                </div>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FaPaperPlane className="mr-2" />
                  Publish Post
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Posts Feed */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <FaBitcoin className="mr-3 text-yellow-400" />
            Latest Discussions
          </h2>

          {filteredAndSortedPosts.length > 0 ? (
            <div className="space-y-8">
              {filteredAndSortedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => markAsViewed(post.id)}
                >
                  {/* Trending Badge */}
                  {post.comments.length > 5 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaFire className="mr-1" />
                      Trending
                    </div>
                  )}

                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={post.author.photoURL}
                          alt={post.author.name}
                          className="w-14 h-14 rounded-full border-2 border-blue-400 shadow-lg"
                        />
                        {viewedPosts.has(post.id) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white">{post.author.name}</h3>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-xs" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <FaEye className="mr-1 text-xs" />
                            {Math.floor(Math.random() * 1000) + 100} views
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                      >
                        <FaEllipsisV />
                      </button>
                      
                      <AnimatePresence>
                        {postMenuOpen === post.id && (
                          <motion.div
                            className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-10 overflow-hidden"
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              onClick={() => {
                                handleBookmark(post.id);
                                setPostMenuOpen(null);
                              }}
                              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center whitespace-nowrap"
                            >
                              <FaBookmark className="mr-2" />
                              {bookmarkedPosts.includes(post.id) ? 'Remove Bookmark' : 'Bookmark Post'}
                            </button>
                            <button
                              onClick={() => {
                                toast("Report functionality coming soon!", { icon: 'ℹ️' });
                                setPostMenuOpen(null);
                              }}
                              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors flex items-center whitespace-nowrap"
                            >
                              <FaFlag className="mr-2" />
                              Report Post
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-white mb-4 leading-tight">{post.title}</h4>
                    <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
                    
                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['crypto', 'blockchain', 'trading'].map((tag) => (
                        <span key={tag} className="flex items-center text-blue-400 text-sm bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                          <FaHashtag className="mr-1 text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-700">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        post.likedBy?.includes(user?.uid || '')
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 scale-105"
                          : "bg-gray-700/50 text-gray-300 hover:bg-red-500/20 hover:text-red-400 border border-gray-600 hover:scale-105"
                      }`}
                    >
                      <FaHeart className="text-lg" />
                      <span className="font-medium">{post.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        post.upvotedBy?.includes(user?.uid || '')
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 scale-105"
                          : "bg-gray-700/50 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-600 hover:scale-105"
                      }`}
                    >
                      <FaArrowUp className="text-lg" />
                      <span className="font-medium">{post.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 border border-gray-600 transition-all duration-300 hover:scale-105"
                    >
                      <FaComment className="text-lg" />
                      <span className="font-medium">{post.comments?.length || 0}</span>
                    </button>

                    <button 
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-green-500/20 hover:text-green-400 border border-gray-600 transition-all duration-300 hover:scale-105"
                    >
                      <FaShare className="text-lg" />
                      <span className="font-medium hidden sm:inline">Share</span>
                    </button>

                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        bookmarkedPosts.includes(post.id)
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-gray-700/50 text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400 border border-gray-600"
                      }`}
                    >
                      <FaBookmark className="text-lg" />
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {(expandedComments[post.id] || post.comments?.length === 0) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                          <FaComment className="mr-2 text-purple-400" />
                          Comments ({post.comments?.length || 0})
                        </h5>

                        {post.comments?.length > 0 ? (
                          <div className="space-y-4 mb-6">
                            {post.comments.map((comment: Comment, index: number) => (
                              <motion.div
                                key={index}
                                className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex items-start space-x-4">
                                  <img
                                    src={comment.author.photoURL}
                                    alt={comment.author.name}
                                    className="w-10 h-10 rounded-full border border-gray-500"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="font-semibold text-white">{comment.author.name}</p>
                                      <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-300">{comment.text}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-center py-8 italic">
                            No comments yet. Be the first to share your thoughts!
                          </p>
                        )}

                        {/* Add Comment */}
                        {user && (
                          <div className="mt-6">
                            <div className="flex space-x-4">
                              <img
                                src={user.photoURL || "/default-avatar.png"}
                                alt={user.displayName || 'User'}
                                className="w-10 h-10 rounded-full border border-gray-500 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <textarea
                                  value={commentText[post.id] || ""}
                                  onChange={(e) =>
                                    setCommentText((prev) => ({
                                      ...prev,
                                      [post.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Share your thoughts..."
                                  className="w-full bg-gray-700/80 backdrop-blur-sm text-white rounded-xl p-4 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                                  rows={3}
                                />
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={() => handleCommentSubmit(post.id)}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 font-medium"
                                  >
                                    Post Comment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FaBitcoin className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No posts yet</h3>
              <p className="text-gray-500">Be the first to share your crypto insights!</p>
            </motion.div>
          )}
        </motion.div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(null)}
            >
              <motion.div
                className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaShare className="mr-2" />
                  Share Post
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShare(showShareModal, 'twitter')}
                    className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                  >
                    <FaTwitter />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare(showShareModal, 'whatsapp')}
                    className="flex items-center justify-center space-x-2 p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-300"
                  >
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare(showShareModal, 'telegram')}
                    className="flex items-center justify-center space-x-2 p-3 bg-blue-400/20 text-blue-300 rounded-xl hover:bg-blue-400/30 transition-all duration-300"
                  >
                    <FaTelegram />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => handleShare(showShareModal, 'copy')}
                    className="flex items-center justify-center space-x-2 p-3 bg-gray-600/20 text-gray-300 rounded-xl hover:bg-gray-600/30 transition-all duration-300"
                  >
                    <FaCopy />
                    <span>Copy Link</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CryptoPost;
