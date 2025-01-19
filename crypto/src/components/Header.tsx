import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { motion } from "framer-motion";

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
      <h1 className="text-2xl font-bold">
        <Link to="/">Crypto Tracker</Link>
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

          <Link
            to="/"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/coins"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Coins
          </Link>
          <Link
            to="/converter"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Converter
          </Link>
          <Link
            to="/news"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            News
          </Link>
          <Link
            to="/compare"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Compare Coins
          </Link>
          <Link
            to="/calendar"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Crypto Calendar
          </Link>
          <Link
            to="/learn"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Learn Crypto
          </Link>
          <Link
            to="/chatbot"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Chatbot
          </Link>
          <Link
            to="/preferences"
            className="text-white text-xl"
            onClick={toggleMenu}
          >
            Preferences
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
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
