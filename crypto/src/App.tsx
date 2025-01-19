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
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
