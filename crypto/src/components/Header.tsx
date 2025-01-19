import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for menu
import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion"; // For smooth sliding animation

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle the mobile menu visibility

  // Firebase auth instance
  const auth = getAuth();

  // Check for logged-in user
  auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  });

  // Handle sign-out
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-black text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Crypto Tracker</h1>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-white text-2xl"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/coins" className="hover:underline">
          Coins
        </Link>
        <Link to="/converter" className="hover:underline">
          Converter
        </Link>
        <Link to="/news" className="hover:underline">
          News
        </Link>
        <Link to="/compare" className="hover:underline">
          Compare Coins
        </Link>
        <Link to="/calendar" className="hover:underline">
          Crypto Calendar
        </Link>
        <Link to="/learn" className="hover:underline">
          Learn Crypto
        </Link>
        <Link to="/chatbot" className="hover:underline">
          Chatbot
        </Link>
        <Link to="/preferences" className="hover:underline">
          Preferences
        </Link>

        {/* Sign-In / Sign-Out Section */}
        {user ? (
          <div className="flex items-center space-x-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center">
                U
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Navigation Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="lg:hidden fixed top-0 right-0 w-64 h-full bg-gradient-to-r from-gray-800 to-black flex flex-col items-center space-y-6 pt-12"
      >
        <Link to="/" className="text-white text-xl">
          Home
        </Link>
        <Link to="/coins" className="text-white text-xl">
          Coins
        </Link>
        <Link to="/converter" className="text-white text-xl">
          Converter
        </Link>
        <Link to="/news" className="text-white text-xl">
          News
        </Link>
        <Link to="/compare" className="text-white text-xl">
          Compare Coins
        </Link>
        <Link to="/calendar" className="text-white text-xl">
          Crypto Calendar
        </Link>
        <Link to="/learn" className="text-white text-xl">
          Learn Crypto
        </Link>
        <Link to="/chatbot" className="text-white text-xl">
          Chatbot
        </Link>
        <Link to="/preferences" className="text-white text-xl">
          Preferences
        </Link>

        {/* Sign-In / Sign-Out Section in Mobile Menu */}
        {user ? (
          <div className="flex items-center space-x-4 mt-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center">
                U
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-6"
          >
            Sign In
          </Link>
        )}
      </motion.div>
    </header>
  );
};

export default Header;
