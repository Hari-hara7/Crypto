import React, { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../utils/firebaseConfig";
import { FaCoins, FaWallet, FaUserEdit, FaSave } from "react-icons/fa";

const Preferences: React.FC = () => {
  const [user, setUser] = useState<any>(auth.currentUser);
  const [preferences, setPreferences] = useState<any>({
    favoriteCoins: "",
    portfolio: "",
    investmentGoal: "",
    riskTolerance: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setPreferences(docSnap.data());
        }
      }
    };

    if (user) {
      fetchPreferences();
    }
  }, [user]);

  // Check if user is signed in with Google
  useEffect(() => {
    if (user && user.providerData[0]?.providerId !== "google.com") {
      setShowAlert(true); // Show alert if user is not signed in with Google
    } else {
      setShowAlert(false); // Hide alert if user is signed in with Google
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const savePreferences = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, preferences, { merge: true });
      alert("Preferences saved successfully!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center">
      <div className="preferences-container p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        {/* Show alert if the user is not signed in with Google */}
        {showAlert && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
            <strong>Alert:</strong> Please sign in with Google to access this feature.
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center mb-6 animate-fadeIn">
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

        <h2 className="text-xl font-bold text-center mb-6">User Preferences</h2>

        {/* Preferences Form */}
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="favoriteCoins" className="block text-lg mb-1">
              <FaCoins className="inline mr-2" /> Favorite Coins:
            </label>
            <input
              type="text"
              id="favoriteCoins"
              name="favoriteCoins"
              value={preferences.favoriteCoins || ""}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="portfolio" className="block text-lg mb-1">
              <FaWallet className="inline mr-2" /> Portfolio:
            </label>
            <input
              type="text"
              id="portfolio"
              name="portfolio"
              value={preferences.portfolio || ""}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="investmentGoal" className="block text-lg mb-1">
              <FaUserEdit className="inline mr-2" /> Investment Goal:
            </label>
            <input
              type="text"
              id="investmentGoal"
              name="investmentGoal"
              value={preferences.investmentGoal || ""}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="riskTolerance" className="block text-lg mb-1">
              Risk Tolerance:
            </label>
            <select
              id="riskTolerance"
              name="riskTolerance"
              value={preferences.riskTolerance || ""}
              onChange={handleChange}
              className="p-3 w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={savePreferences}
            className="p-3 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <FaSave className="mr-2" /> Save Preferences
          </button>
        </div>

        {/* Display Saved Preferences */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold flex items-center">
            <FaSave className="mr-2 text-blue-500" /> Saved Preferences:
          </h3>
          <div className="mt-3 bg-gray-700 p-4 rounded-lg shadow-md">
            <p className="flex items-center">
              <FaCoins className="mr-2 text-yellow-400" />
              <strong>Favorite Coins:</strong> {preferences.favoriteCoins || "Not set"}
            </p>
            <p className="flex items-center mt-2">
              <FaWallet className="mr-2 text-green-400" />
              <strong>Portfolio:</strong> {preferences.portfolio || "Not set"}
            </p>
            <p className="flex items-center mt-2">
              <FaUserEdit className="mr-2 text-blue-400" />
              <strong>Investment Goal:</strong> {preferences.investmentGoal || "Not set"}
            </p>
            <p className="flex items-center mt-2">
              <FaSave className="mr-2 text-red-400" />
              <strong>Risk Tolerance:</strong> {preferences.riskTolerance || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
