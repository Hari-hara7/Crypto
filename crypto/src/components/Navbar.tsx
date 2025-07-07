import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignInAlt, FaUserPlus, FaPlusCircle, FaSignOutAlt, FaBars } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-black text-white py-4 px-6 flex justify-between items-center shadow-lg relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-teal-400">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-7 h-7 text-teal-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
          <span>Crypto Tracker</span>
        </Link>
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/create"
              className="flex items-center space-x-1 text-teal-300 hover:text-teal-400 font-semibold transition-colors duration-300"
            >
              <FaPlusCircle className="text-lg" />
              <span>Create</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-400 hover:text-red-500 font-semibold transition-colors duration-300"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center space-x-1 text-teal-300 hover:text-teal-400 font-semibold transition-colors duration-300"
            >
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 text-green-400 hover:text-green-500 font-semibold transition-colors duration-300"
            >
              <FaUserPlus className="text-lg" />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="md:hidden">
        <FaBars className="w-6 h-6 text-teal-400" />
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-gray-900 rounded-lg shadow-lg flex flex-col items-start p-4 gap-4 z-50">
          {user ? (
            <>
              <Link
                to="/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-teal-300 hover:text-teal-400 font-semibold transition-colors duration-300"
              >
                <FaPlusCircle />
                <span>Create</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-400 hover:text-red-500 font-semibold transition-colors duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-teal-300 hover:text-teal-400 font-semibold transition-colors duration-300"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-green-400 hover:text-green-500 font-semibold transition-colors duration-300"
              >
                <FaUserPlus />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
