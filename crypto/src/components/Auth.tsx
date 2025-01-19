import React, { useState, useEffect } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../utils/firebaseConfig";
import { FaGoogle, FaUserAlt, FaEnvelope, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"; // Additional icons for sign-out

const Auth: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  // Fetching user creation date
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-80 md:w-96">
        {user ? (
          <div className="flex flex-col items-center">
            {/* User Avatar */}
            <img
              src={user.photoURL || ""}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-md border-2 border-teal-500 mb-4"
            />
            <p className="text-2xl font-semibold text-gray-100 mb-4">
              Welcome, {user.displayName}
            </p>

            {/* Enhanced Welcome Message */}
            <p className="text-center text-gray-300 text-sm mb-6">
              You are now connected with <strong>Crypto Tracker</strong> — the ultimate platform to track and analyze cryptocurrency prices, market trends, news, and more! We're glad to have you join our community of crypto enthusiasts.
            </p>

            {/* User Information */}
            <div className="text-gray-300 text-sm mb-4 space-y-2">
              <div className="flex items-center space-x-2">
                <FaUserAlt />
                <span>{user.displayName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt />
                <span>Joined: {formatDate(user.metadata.creationTime)}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 w-full mt-4 flex items-center justify-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-gray-400 mb-6">
              Sign in to access your account and start exploring the world of cryptocurrency!
            </p>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center transition duration-300 w-full"
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Login with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
