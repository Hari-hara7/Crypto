import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);

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
      <h1 className="text-2xl font-bold">Crypto Tracker</h1>
      <nav className="flex items-center">
        <Link to="/" className="mx-4 hover:underline">
          Home
        </Link>
        <Link to="/coins" className="mx-4 hover:underline">
          Coins
        </Link>
        <Link to="/converter" className="mx-4 hover:underline">
          Converter
        </Link>
        <Link to="/news" className="mx-4 hover:underline">
          News
        </Link>
        <Link to="/compare" className="mx-4 hover:underline">
          Compare Coins
        </Link>
        <Link to="/calendar" className="mx-4 hover:underline">
          Crypto Calendar
        </Link>
        <Link to="/learn" className="mx-4 hover:underline">
          Learn Crypto
        </Link>
        <Link to="/chatbot" className="mx-4 hover:underline">
          Chatbot
        </Link>
        <Link to="/preferences" className="mx-4 hover:underline">
          Preferences
        </Link> {/* Link to Preferences */}

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
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
