import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { getAuth, signOut, User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaSignInAlt, FaBitcoin, FaUserCircle } from "react-icons/fa";
import { AiOutlineHome, AiOutlineCalculator, AiOutlineCalendar, AiOutlineSetting, AiOutlineRead } from "react-icons/ai";
import { FaCoins, FaRegNewspaper, FaRobot, FaBook, FaChartLine, FaBell } from "react-icons/fa";
import { MdCompareArrows, MdPostAdd } from "react-icons/md";
import { BsGrid3X3Gap } from "react-icons/bs";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: <AiOutlineHome className="text-lg" /> 
    },
    {
      name: "Markets",
      icon: <FaChartLine className="text-lg" />,
      dropdown: [
        { name: "All Coins", path: "/coins", icon: <FaCoins /> },
        { name: "Coin Details", path: "/coins-details", icon: <BsGrid3X3Gap /> },
        { name: "Compare Coins", path: "/compare", icon: <MdCompareArrows /> },
      ]
    },
    {
      name: "Tools",
      icon: <AiOutlineCalculator className="text-lg" />,
      dropdown: [
        { name: "Converter", path: "/converter", icon: <AiOutlineCalculator /> },
        { name: "AI Prediction", path: "/predict", icon: <FaRobot /> },
        { name: "Crypto Calendar", path: "/calendar", icon: <AiOutlineCalendar /> },
      ]
    },
    {
      name: "Resources",
      icon: <AiOutlineRead className="text-lg" />,
      dropdown: [
        { name: "News", path: "/news", icon: <FaRegNewspaper /> },
        { name: "Learn Crypto", path: "/learn", icon: <FaBook /> },
        { name: "Posts", path: "/crypto-posts", icon: <MdPostAdd /> },
      ]
    },
    { 
      name: "Notifications", 
      path: "/notifications", 
      icon: <FaBell className="text-lg" /> 
    },
    { 
      name: "Preferences", 
      path: "/preferences", 
      icon: <AiOutlineSetting className="text-lg" /> 
    },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          scrolled 
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50" 
            : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        }`}
      >
        <div className="w-full max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-teal-400 to-blue-500 p-2 md:p-2.5 rounded-lg">
                  <FaBitcoin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">
                  Crypto Tracker
                </span>
                <span className="text-xs text-teal-400 font-medium hidden sm:block">
                  Real-time Market Data
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                item.dropdown ? (
                  <div 
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-800/50">
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                      <FiChevronDown className={`text-sm transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
                        >
                          {item.dropdown.map((dropItem, idx) => (
                            <Link
                              key={idx}
                              to={dropItem.path}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 group/item"
                            >
                              <span className="text-teal-400 group-hover/item:text-teal-300 transition-colors">
                                {dropItem.icon}
                              </span>
                              <span className="font-medium">{dropItem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path!}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "text-white bg-teal-500/20 border border-teal-500/50"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </nav>

            <div className="flex items-center space-x-3 md:space-x-4 z-50">
              <div className="hidden xl:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border-2 border-teal-400 ring-2 ring-gray-700"
                      />
                    )}
                    <button
                      onClick={handleSignOut}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/50"
                    >
                      <FaSignOutAlt />
                      <span className="hidden lg:inline">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-teal-500/50"
                  >
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              <button
                className="xl:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 md:top-20 left-0 right-0 z-50 xl:hidden max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl">
                <div className="container mx-auto px-4 py-6">
                  {user && (
                    <div className="flex items-center space-x-3 p-4 mb-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-teal-400"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                          <FaUserCircle className="text-white text-2xl" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white font-semibold">{user.displayName || "User"}</p>
                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {navItems.map((item) => (
                      item.dropdown ? (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center space-x-2 px-4 py-2 text-teal-400 font-semibold text-sm uppercase tracking-wide">
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          {item.dropdown.map((dropItem, idx) => (
                            <Link
                              key={idx}
                              to={dropItem.path}
                              onClick={toggleMenu}
                              className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                                location.pathname === dropItem.path
                                  ? "text-white bg-teal-500/20 border border-teal-500/50"
                                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                              }`}
                            >
                              <span className="text-teal-400">{dropItem.icon}</span>
                              <span className="font-medium">{dropItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path!}
                          onClick={toggleMenu}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            location.pathname === item.path
                              ? "text-white bg-teal-500/20 border border-teal-500/50"
                              : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    {user ? (
                      <button
                        onClick={() => {
                          handleSignOut();
                          toggleMenu();
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={toggleMenu}
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg"
                      >
                        <FaSignInAlt className="text-lg" />
                        <span>Sign In</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
