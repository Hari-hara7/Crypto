// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig"; // Assuming Firebase setup is in this file

// Define User type
interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null')); // Persist user from localStorage

  // Sync Firebase user with local state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // Assuming Firebase user has uid, email, etc., adjust as needed
        const userData: User = {
          _id: currentUser.uid,
          username: currentUser.displayName || '',
          email: currentUser.email || '',
          token: currentUser.refreshToken,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
      } else {
        setUser(null);
        localStorage.removeItem('user'); // Remove from localStorage when logged out
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove from localStorage
    auth.signOut(); // Also sign out from Firebase
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
