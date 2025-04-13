// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Coins from "./pages/Coins";
import Converter from "./components/Converter";
import NewsFeed from "./components/NewsFeed";
import HistoricalChart from './components/HistoricalChart';
import CoinComparison from './components/CoinComparison'; 
import CalendarPage from "./pages/CalendarPage";
import LearnCrypto from './components/LearnCrypto';
import Chatbot from './components/CryptoChatbot'; 
import Auth from "./components/Auth"; 
import Preferences from "./components/Preferences"; 
import CryptoPost from './components/CryptoPost';
import CoinList from './components/CoinList'; 
import CryptoNotification from "./components/CryptoNotification";
import PriceHistoryPage from "./pages/PriceHistoryPage";  // Import your new page
import History from "./pages/History";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Existing routes */}
            <Route path="/" element={<Home />} />
            <Route path="/coins" element={<Coins />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/historical-chart" element={<HistoricalChart />} />
            <Route path="/compare" element={<CoinComparison />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/learn" element={<LearnCrypto />} />
            <Route path="/chatbot" element={<Chatbot />} /> 
            <Route path="/auth" element={<Auth />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/crypto-posts" element={<CryptoPost />} />
            <Route path="/coins-details" element={<CoinList />} />
            <Route path="/notifications" element={<CryptoNotification />} />//History

            <Route path="/history" element={<History />} />
            <Route path="/price-history/:symbol" element={<PriceHistoryPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
