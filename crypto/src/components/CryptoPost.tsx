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
import { FaGoogle, FaPaperPlane, FaBitcoin, FaThumbsUp, FaArrowUp, FaComment } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const CryptoPost: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showAlert, setShowAlert] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-black to-gray-900 text-white flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-6 bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full mx-4">
        <h1 className="text-3xl font-extrabold text-center mb-8 flex items-center justify-center text-yellow-400">
          <FaBitcoin className="mr-2 animate-bounce" /> Crypto Posts
        </h1>

        {showAlert && (
          <div className="bg-red-600 text-white p-4 mb-6 rounded-lg shadow-md">
            <strong>Alert:</strong> Only Google-signed-in users can post about cryptocurrency.
          </div>
        )}

        {user && !showAlert && (
          <form onSubmit={handlePostSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-semibold mb-2">Post Title:</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-4 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter the post title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-lg font-semibold mb-2">Post Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-4 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                rows={5}
                placeholder="Write about cryptocurrency here..."
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:scale-105 transition-transform"
              >
                <FaPaperPlane className="mr-2 inline-block" /> Submit Post
              </button>
            </div>
          </form>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaBitcoin className="mr-2 text-yellow-400" /> Latest Posts:
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="p-6 bg-gray-700 rounded-lg shadow-lg">
                  <div className="flex items-center mb-3">
                    <img
                      src={post.author.photoURL}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <span className="font-bold text-lg">{post.author.name}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="mb-4 text-gray-300">{post.content}</p>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center p-2 rounded-lg ${
                        post.likedBy?.includes(user?.uid) ? "text-yellow-500" : "text-yellow-400"
                      } hover:bg-yellow-800`}
                    >
                      <FaThumbsUp className="mr-1" /> {post.likes || 0} Likes
                    </button>

                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center p-2 rounded-lg ${
                        post.upvotedBy?.includes(user?.uid) ? "text-blue-500" : "text-blue-400"
                      } hover:bg-blue-800`}
                    >
                      <FaArrowUp className="mr-1" /> {post.upvotes || 0} Upvotes
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="mt-6">
                    <h4 className="text-lg font-bold mb-3 flex items-center">
                      <FaComment className="mr-2" /> Comments:
                    </h4>
                    {post.comments?.length > 0 ? (
                      <ul className="space-y-3">
                        {post.comments.map((comment: any, index: number) => (
                          <li
                            key={index}
                            className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3"
                          >
                            <img
                              src={comment.author.photoURL}
                              alt={comment.author.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-bold">{comment.author.name}</p>
                              <p>{comment.text}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No comments yet.</p>
                    )}

                    {user && (
                      <div className="mt-4">
                        <textarea
                          value={commentText[post.id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="w-full bg-gray-800 text-white rounded-lg p-3 mb-2"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md"
                        >
                          Submit Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPost;
