import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../utils/firebaseConfig";
import { FaGoogle } from "react-icons/fa"; // Google Icon from react-icons

const Auth: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-80 md:w-96">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.photoURL || ""}
              alt="User Avatar"
              className="w-20 h-20 rounded-full shadow-md border-2 border-blue-500 mb-4"
            />
            <p className="text-2xl font-semibold text-gray-100 mb-4">
              Welcome, {user.displayName}
            </p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 w-full mt-4">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-gray-400 mb-6">
              Sign in to access your account
            </p>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center transition duration-300 w-full">
              <FaGoogle className="w-5 h-5 mr-2" />
              Login with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
