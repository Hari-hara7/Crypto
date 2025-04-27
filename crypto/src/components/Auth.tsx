import React, { useState, useEffect } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../utils/firebaseConfig";
import { FaGoogle, FaUserAlt, FaEnvelope, FaCalendarAlt, FaSignOutAlt,FaBlogger  } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaCoins, FaComments, FaCogs, FaNewspaper } from "react-icons/fa";
const Auth: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-8 w-80 md:w-96 transform transition-all duration-500 hover:scale-105">
        {user ? (
          <div className="flex flex-col items-center">
            {/* User Avatar */}
            <img
              src={user.photoURL || ""}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-teal-500 mb-6 transition duration-300 hover:scale-110"
            />
            <p className="text-2xl font-bold text-gray-100 mb-4">
              Welcome, {user.displayName}
            </p>

            <p className="text-center text-gray-300 text-sm mb-6">
              You are now connected with <strong>Crypto Tracker</strong> — explore cryptocurrency trends, market insights, and more!
            </p>

            {/* User Information */}
            <div className="text-gray-400 text-sm mb-6 space-y-2 w-full">
              <div className="flex items-center space-x-3">
                <FaUserAlt />
                <span>{user.displayName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt />
                <span>Joined: {formatDate(user.metadata.creationTime)}</span>
              </div>
            </div>
{/* Navigation Links with Glassmorphism */}
<div className="space-y-4 mb-6 w-full text-center">


  <Link
    to="/coins"
    className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 hover:text-white hover:bg-white/20 transition duration-300 shadow-md"
  >
    <FaCoins /> Browse Coins
  </Link>

  <Link
    to="/chatRoom"
    className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-green-300 hover:text-white hover:bg-white/20 transition duration-300 shadow-md"
  >
    <FaComments /> Chat Room
  </Link>

  <Link
    to="/preferences"
    className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-white/20 transition duration-300 shadow-md"
  >
    <FaCogs /> Preferences
  </Link>
  <Link
  to="/home"
  className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-white/20 transition duration-300 shadow-md"
>
  <FaBlogger /> Blogs
</Link>
  <Link
    to="/crypto-posts"
    className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-pink-300 hover:text-white hover:bg-white/20 transition duration-300 shadow-md"
  >
    <FaNewspaper /> Crypto Posts
  </Link>
</div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg w-full flex items-center justify-center space-x-2 transform transition duration-300 hover:scale-105"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-400 mb-6 text-center">
              Sign in to explore and track cryptocurrency trends!
            </p>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg w-full flex items-center justify-center space-x-2 transform transition duration-300 hover:scale-105"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Login with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
