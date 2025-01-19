import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaBars, FaTimes } from "react-icons/fa";

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="bg-primary text-white py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-bold">Crypto Tracker</h1>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <nav
        className={`md:flex items-center space-x-6 ${
          isMobileMenuOpen
            ? "absolute top-16 left-0 w-full bg-primary text-center py-4"
            : "hidden md:flex"
        }`}
      >
        <Link to="/" className="block mx-4 hover:underline">
          Home
        </Link>
        <Link to="/coins" className="block mx-4 hover:underline">
          Coins
        </Link>
        <Link to="/converter" className="block mx-4 hover:underline">
          Converter
        </Link>
        <Link to="/news" className="block mx-4 hover:underline">
          News
        </Link>
        <Link to="/compare" className="block mx-4 hover:underline">
          Compare Coins
        </Link>
        <Link to="/calendar" className="block mx-4 hover:underline">
          Crypto Calendar
        </Link>
        <Link to="/learn" className="block mx-4 hover:underline">
          Learn Crypto
        </Link>
        <Link to="/chatbot" className="block mx-4 hover:underline">
          Chatbot
        </Link>
        <Link to="/preferences" className="block mx-4 hover:underline">
          Preferences
        </Link>

        {/* Sign-In / Sign-Out Section */}
        {user ? (
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 md:mt-0"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
