import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaCoins, FaWallet, FaUserEdit, FaSave, FaChartPie } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF4444", "#44FF77"];

const Preferences: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<any>({
    favoriteCoins: "",
    portfolio: "",
    investmentGoal: "",
    riskTolerance: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPreferences(data);
            if (data.portfolio) parsePortfolio(data.portfolio);
          }
        }
      } catch (error) {
        toast.error("Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPreferences();
  }, [user]);

  // Google login check
  useEffect(() => {
    if (user) {
      const isGoogleUser = user.providerData[0]?.providerId === "google.com";
      setShowAlert(!isGoogleUser);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "portfolio") {
      parsePortfolio(value);
    }
  };

  const savePreferences = async () => {
    if (
      !preferences.favoriteCoins ||
      !preferences.portfolio ||
      !preferences.investmentGoal ||
      !preferences.riskTolerance
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, preferences, { merge: true });
        toast.success("Preferences saved successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while saving preferences.");
    } finally {
      setLoading(false);
    }
  };

  // Parse "BTC:40,ETH:30" to [{ name: 'BTC', value: 40 }, ...]
  const parsePortfolio = (portfolioString: string) => {
    try {
      const parsed = portfolioString.split(",").map((entry) => {
        const [name, value] = entry.split(":");
        return { name: name.trim(), value: parseFloat(value.trim()) };
      });
      setPortfolioData(parsed);
    } catch (error) {
      toast.error("Invalid portfolio format. Use BTC:40,ETH:60");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center">
      <Toaster />
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full mx-4">
        {showAlert && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
            <strong>Alert:</strong> Please sign in with Google to access this feature.
          </div>
        )}

        {user && (
          <div className="flex items-center mb-6">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-center mb-6">User Preferences</h2>
        {loading && <p className="text-center my-4">Loading...</p>}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              <FaCoins className="inline mr-2" /> Favorite Coins:
            </label>
            <input
              name="favoriteCoins"
              value={preferences.favoriteCoins}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">
              <FaWallet className="inline mr-2" /> Portfolio (e.g., BTC:40,ETH:30):
            </label>
            <input
              name="portfolio"
              value={preferences.portfolio}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">
              <FaUserEdit className="inline mr-2" /> Investment Goal:
            </label>
            <input
              name="investmentGoal"
              value={preferences.investmentGoal}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">Risk Tolerance:</label>
            <select
              name="riskTolerance"
              value={preferences.riskTolerance}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 rounded-lg border border-gray-600"
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-center mt-6">
          <button
            onClick={savePreferences}
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <FaSave className="inline mr-2" /> {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        {/* Pie Chart Preview */}
        {portfolioData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartPie className="mr-2 text-yellow-400" /> Portfolio Breakdown:
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {portfolioData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;
