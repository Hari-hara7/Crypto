import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Coins from "./pages/Coins";
import Converter from "./components/Converter";
import NewsFeed from "./components/NewsFeed";
import HistoricalChart from './components/HistoricalChart';
import CoinComparison from './components/CoinComparison'; // Import CoinComparison
import CalendarPage from "./pages/CalendarPage";
import LearnCrypto from './components/LearnCrypto';
import Chatbot from './components/CryptoChatbot'; // Import the Chatbot component

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coins" element={<Coins />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/historical-chart" element={<HistoricalChart />} />
            <Route path="/compare" element={<CoinComparison />} /> {/* Add CoinComparison route */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/learn" element={<LearnCrypto />} />
            {/* Update this route to show the Chatbot */}
           
            <Route path="/chatbot" element={<Chatbot />} />  {/* Add Chatbot route */}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
