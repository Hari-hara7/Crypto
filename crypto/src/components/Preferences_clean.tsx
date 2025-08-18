import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { 
  FaCoins, 
  FaWallet, 
  FaSave, 
  FaChartPie, 
  FaBell,
  FaCog,
  FaUser
} from "react-icons/fa";
import { FiTarget, FiTrendingUp } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PortfolioAsset {
  name: string;
  value: number;
  color: string;
}

interface PreferencesData {
  favoriteCoins: string[];
  portfolio: PortfolioAsset[];
  investmentGoal: string;
  riskTolerance: string;
  currency: string;
  notifications: {
    priceAlerts: boolean;
    news: boolean;
    portfolio: boolean;
  };
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const Preferences: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'notifications'>('profile');
  const [preferences, setPreferences] = useState<PreferencesData>({
    favoriteCoins: [],
    portfolio: [],
    investmentGoal: '',
    riskTolerance: '',
    currency: 'USD',
    notifications: {
      priceAlerts: true,
      news: true,
      portfolio: true
    }
  });

  const portfolioData = preferences.portfolio.filter(asset => asset.value > 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
        loadUserPreferences(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserPreferences = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "userPreferences", userId));
      if (userDoc.exists()) {
        setPreferences(userDoc.data() as PreferencesData);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Failed to load preferences");
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, "userPreferences", user.uid), preferences);
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PreferencesData] as any,
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePortfolioChange = (index: number, field: 'name' | 'value', value: string | number) => {
    const newPortfolio = [...preferences.portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setPreferences(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  const addPortfolioAsset = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];
    const newAsset: PortfolioAsset = {
      name: '',
      value: 0,
      color: colors[preferences.portfolio.length % colors.length]
    };
    setPreferences(prev => ({ ...prev, portfolio: [...prev.portfolio, newAsset] }));
  };

  const removePortfolioAsset = (index: number) => {
    const newPortfolio = preferences.portfolio.filter((_, i) => i !== index);
    setPreferences(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  const addFavoriteCoin = () => {
    setPreferences(prev => ({ ...prev, favoriteCoins: [...prev.favoriteCoins, ''] }));
  };

  const removeFavoriteCoin = (index: number) => {
    const newFavorites = preferences.favoriteCoins.filter((_, i) => i !== index);
    setPreferences(prev => ({ ...prev, favoriteCoins: newFavorites }));
  };

  const updateFavoriteCoin = (index: number, value: string) => {
    const newFavorites = [...preferences.favoriteCoins];
    newFavorites[index] = value;
    setPreferences(prev => ({ ...prev, favoriteCoins: newFavorites }));
  };

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'portfolio', label: 'Portfolio', icon: FaWallet },
    { id: 'notifications', label: 'Notifications', icon: FaBell }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'notifications':
        return renderNotificationsTab();
      default:
        return renderProfileTab();
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-6 flex items-center">
        <FaUser className="mr-2" />
        Profile Settings
      </h3>

      {/* Favorite Coins */}
      <div className="bg-gray-700/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium flex items-center">
            <FaCoins className="mr-2 text-yellow-400" />
            Favorite Cryptocurrencies
          </h4>
          <button
            onClick={addFavoriteCoin}
            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-colors duration-200"
          >
            Add Coin
          </button>
        </div>
        <div className="space-y-3">
          {preferences.favoriteCoins.map((coin, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={coin}
                onChange={(e) => updateFavoriteCoin(index, e.target.value)}
                placeholder="Enter coin symbol (e.g., BTC, ETH)"
                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-teal-400 focus:outline-none"
              />
              <button
                onClick={() => removeFavoriteCoin(index)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          {preferences.favoriteCoins.length === 0 && (
            <p className="text-gray-400 text-center py-4">No favorite coins added yet</p>
          )}
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700/30 rounded-lg p-6">
          <label className="block text-sm text-gray-300 mb-3 flex items-center">
            <FiTarget className="mr-2 text-teal-400" />
            Investment Goal
          </label>
          <select
            name="investmentGoal"
            value={preferences.investmentGoal}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-teal-400 focus:outline-none"
          >
            <option value="">Select Goal</option>
            <option value="long-term">Long-term Growth</option>
            <option value="short-term">Short-term Gains</option>
            <option value="passive-income">Passive Income</option>
            <option value="diversification">Portfolio Diversification</option>
          </select>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-6">
          <label className="block text-sm text-gray-300 mb-3 flex items-center">
            <FiTrendingUp className="mr-2 text-red-400" />
            Risk Tolerance
          </label>
          <select
            name="riskTolerance"
            value={preferences.riskTolerance}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-teal-400 focus:outline-none"
          >
            <option value="">Select Risk Level</option>
            <option value="low">Conservative (Low Risk)</option>
            <option value="medium">Moderate (Medium Risk)</option>
            <option value="high">Aggressive (High Risk)</option>
          </select>
        </div>
      </div>

      {/* Currency Preference */}
      <div className="bg-gray-700/30 rounded-lg p-6">
        <label className="block text-sm text-gray-300 mb-3 flex items-center">
          <FaCoins className="mr-2 text-green-400" />
          Preferred Currency
        </label>
        <select
          name="currency"
          value={preferences.currency}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-teal-400 focus:outline-none"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="BTC">BTC - Bitcoin</option>
          <option value="ETH">ETH - Ethereum</option>
        </select>
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-blue-400 flex items-center">
          <FaChartPie className="mr-2" />
          Portfolio Allocation
        </h3>
        <button
          onClick={addPortfolioAsset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors duration-200"
        >
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {preferences.portfolio.map((asset, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: asset.color }}
                ></div>
                <input
                  type="text"
                  value={asset.name}
                  onChange={(e) => handlePortfolioChange(index, 'name', e.target.value)}
                  placeholder="Asset name (e.g., Bitcoin)"
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-teal-400 focus:outline-none"
                />
                <button
                  onClick={() => removePortfolioAsset(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-300">Allocation %:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={asset.value}
                  onChange={(e) => handlePortfolioChange(index, 'value', parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:border-teal-400 focus:outline-none"
                />
                <span className="text-gray-400">%</span>
              </div>
            </div>
          ))}
          {preferences.portfolio.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No portfolio assets added yet. Click "Add Asset" to start building your portfolio.
            </div>
          )}
        </div>

        {portfolioData.length > 0 && (
          <div className="bg-gray-700/30 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4 text-center">Portfolio Visualization</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Total Allocation: {portfolioData.reduce((sum, asset) => sum + asset.value, 0)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-6 flex items-center">
        <FaBell className="mr-2" />
        Notification Preferences
      </h3>
      <div className="space-y-6">
        {[
          { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when your favorite coins hit price targets' },
          { key: 'news', label: 'News Updates', desc: 'Receive latest cryptocurrency news and market updates' },
          { key: 'portfolio', label: 'Portfolio Changes', desc: 'Notifications for significant portfolio value changes' }
        ].map((notification) => (
          <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">{notification.label}</h4>
              <p className="text-sm text-gray-400">{notification.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name={`notifications.${notification.key}`}
                checked={preferences.notifications?.[notification.key as keyof typeof preferences.notifications] || false}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access preferences</h2>
          <p className="text-gray-400">You need to be authenticated to view and modify your preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#14b8a6" },
            links: {
              color: "#14b8a6",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              User Preferences
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Customize your crypto trading experience with personalized settings and portfolio management
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={savePreferences}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {loading ? "Saving..." : "Save All"}
          </button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="bg-gray-800/80 backdrop-blur-md rounded-2xl mb-8 border border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'portfolio' | 'notifications')}
                className={`flex-1 min-w-[120px] py-4 px-6 text-center font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white border-b-2 border-teal-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="mx-auto mb-1 text-lg" />
                <div className="text-sm">{tab.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          className="bg-gray-800/60 rounded-xl p-8 backdrop-blur-md border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        }}
      />
    </div>
  );
};

export default Preferences;
