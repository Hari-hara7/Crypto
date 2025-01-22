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
import { FaGoogle, FaPaperPlane, FaBitcoin, FaThumbsUp, FaArrowUp } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

const CryptoPost: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Check if the user is signed in with Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const isGoogleUser = user?.providerData[0]?.providerId === "google.com";
    setShowAlert(!isGoogleUser);
  }, [user]);

  // Fetch posts in real-time
  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "crypto_posts"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsArray: any[] = [];
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postsArray);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in both title and content.");
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
        likes: 0, // Initialize likes
        upvotes: 0, // Initialize upvotes
        likedBy: [], // Track users who liked
        upvotedBy: [], // Track users who upvoted
      });

      setTitle("");
      setContent("");
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while submitting the post.");
    }
  };

  // Handle like
  const handleLike = async (postId: string) => {
    if (!user) {
      alert("You must be signed in to like posts.");
      return;
    }

    const postRef = doc(db, "crypto_posts", postId);
    const post = posts.find((post) => post.id === postId);

    if (post.likedBy?.includes(user.uid)) {
      // Unlike the post if already liked
      await updateDoc(postRef, {
        likes: (post.likes || 0) - 1,
        likedBy: arrayRemove(user.uid),
      });
    } else {
      // Like the post
      await updateDoc(postRef, {
        likes: (post.likes || 0) + 1,
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  // Handle upvote
  const handleUpvote = async (postId: string) => {
    if (!user) {
      alert("You must be signed in to upvote posts.");
      return;
    }

    const postRef = doc(db, "crypto_posts", postId);
    const post = posts.find((post) => post.id === postId);

    if (post.upvotedBy?.includes(user.uid)) {
      // Remove upvote if already upvoted
      await updateDoc(postRef, {
        upvotes: (post.upvotes || 0) - 1,
        upvotedBy: arrayRemove(user.uid),
      });
    } else {
      // Add upvote
      await updateDoc(postRef, {
        upvotes: (post.upvotes || 0) + 1,
        upvotedBy: arrayUnion(user.uid),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
          <FaBitcoin className="text-yellow-400 mr-2" /> Crypto Posts
        </h1>

        {/* Alert for non-Google users */}
        {showAlert && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
            <strong>Alert:</strong> Only Google-signed-in users can post about cryptocurrency.
          </div>
        )}

        {/* Post Form */}
        {user && !showAlert && (
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="block text-lg mb-1">
                Post Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter the post title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content" className="block text-lg mb-1">
                Post Content:
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                rows={5}
                placeholder="Write about cryptocurrency here..."
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition duration-300 shadow-md"
              >
                <FaPaperPlane className="mr-2" /> Submit Post
              </button>
            </div>
          </form>
        )}

        {/* Display Posts */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaBitcoin className="mr-2 text-yellow-400" /> Latest Posts:
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-gray-700 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={post.author.photoURL}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="font-bold text-white">{post.author.name}</span>
                    <span className="ml-2 text-gray-400">({post.author.email})</span>
                  </div>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-200">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted on: {new Date(post.createdAt).toLocaleString()}
                  </p>

                  {/* Like and Upvote Buttons */}
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center ${
                        post.likedBy?.includes(user?.uid)
                          ? "text-yellow-500"
                          : "text-yellow-400"
                      } hover:text-yellow-500 transition duration-200`}
                    >
                      <FaThumbsUp className="mr-1" /> {post.likes || 0} Likes
                    </button>
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center ${
                        post.upvotedBy?.includes(user?.uid)
                          ? "text-blue-500"
                          : "text-blue-400"
                      } hover:text-blue-500 transition duration-200`}
                    >
                      <FaArrowUp className="mr-1" /> {post.upvotes || 0} Upvotes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No posts available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPost;
