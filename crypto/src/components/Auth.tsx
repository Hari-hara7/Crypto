import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../utils/firebaseConfig";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-80">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.photoURL || ""}
              alt="User Avatar"
              className="w-20 h-20 rounded-full shadow-md border-2 border-blue-500 mb-4"
            />
            <p className="text-xl font-semibold text-gray-700 mb-4">
              Welcome, {user.displayName}
            </p>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium text-gray-600 mb-6">
              Sign in to access your account
            </p>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center transition duration-300">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
