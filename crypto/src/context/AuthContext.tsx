
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig"; 

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {

        const userData: User = {
          _id: currentUser.uid,
          username: currentUser.displayName || '',
          email: currentUser.email || '',
          token: currentUser.refreshToken,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
      } else {
        setUser(null);
        localStorage.removeItem('user'); 
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
    auth.signOut();
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
