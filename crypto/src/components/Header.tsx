import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { AiOutlineHome, AiOutlineCalculator, AiOutlineCalendar, AiOutlineSetting } from "react-icons/ai";
import { FaCoins, FaRegNewspaper, FaRobot, FaBook } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-black text-white py-4 px-6 flex justify-between items-center">
       <h1 className="text-2xl font-bold text-teal-400 flex items-center space-x-2">
    <Link to="/" className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="w-6 h-6 text-teal-400"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
      <span>Crypto Tracker</span>
    </Link>
  </h1>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-white text-2xl focus:outline-none"
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
        <Link to="/coins-details" className="hover:underline">
          coins details
        </Link>
        <Link to="/compare" className="hover:underline">
          Compare Coins
        </Link>
        
        <Link to="/chatbot" className="hover:underline">
          GPT
        </Link>
        <Link to="/news" className="hover:underline">
          News
        </Link>
        <Link to="/converter" className="hover:underline">
          Converter
        </Link>
        
        <Link to="/calendar" className="hover:underline">
          Crypto Calendar
        </Link>
        <Link to="/learn" className="hover:underline">
          Learn Crypto
        </Link>
       
        <Link to="/preferences" className="hover:underline">
          Preferences
        </Link>
        <Link to="/crypto-posts" className="hover:underline">
          post
        </Link>
      
      
        <Link to="/notifications" className="hover:underline">
          Notifications
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-teal-400"
              />
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaSignOutAlt className="text-lg" />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-teal-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaSignInAlt className="text-lg" />
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="lg:hidden fixed top-0 right-0 w-64 h-full bg-gradient-to-r from-gray-800 to-black z-50 flex flex-col items-center space-y-6 pt-12"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-2xl text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          <Link to="/" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <AiOutlineHome /> Home
    </Link>
    <Link to="/coins" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaCoins /> Coins
    </Link>
    <Link to="/coins-details" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaCoins /> coins details
    </Link>
    <Link to="/chatbot" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaRobot /> Gpt
    </Link>
    <Link to="/converter" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <AiOutlineCalculator /> Converter
    </Link>
    <Link to="/news" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaRegNewspaper /> News
    </Link>
    <Link to="/compare" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaBook /> Compare
    </Link>
    <Link to="/calendar" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <AiOutlineCalendar /> Crypto Calendar
    </Link>
    <Link to="/learn" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaBook /> Learn Crypto
    </Link>
  
    <Link to="/preferences" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <AiOutlineSetting /> Preferences
    </Link>
    <Link to="/crypto-posts" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <AiOutlineSetting /> Posts
    </Link>
  
    <Link to="/notifications" className="text-white text-xl flex items-center gap-2" onClick={toggleMenu}>
      <FaCoins /> Live Notifications
    </Link>
          {user ? (
            <div className="flex flex-col items-center space-y-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-teal-400"
                />
              )}
              <button
                onClick={() => {
                  handleSignOut();
                  toggleMenu();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaSignOutAlt className="text-lg" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-teal-400 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={toggleMenu}
            >
              <FaSignInAlt className="text-lg" />
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
