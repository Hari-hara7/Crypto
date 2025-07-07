import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
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
import PriceHistoryPage from "./pages/PriceHistoryPage";  
import History from "./pages/History";
import ChatRoom from "./pages/ChatRoom";  
import Homee from "./pages/Homee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import AddCryptoEventForm from "./components/AddCryptoEventForm";

const App: React.FC = () => {

  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">

      {location.pathname !== "/home" && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/create" && !location.pathname.includes("/blog") && <Header />}

    
      {(location.pathname === "/home" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/create" || location.pathname.includes("/blog")) && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coins" element={<Coins />} />
          <Route path="/admin" element={<AddCryptoEventForm />} />
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
          <Route path="/notifications" element={<CryptoNotification />} />
          <Route path="/history" element={<History />} />
          <Route path="/price-history/:symbol" element={<PriceHistoryPage />} />
          <Route path="/chatRoom" element={<ChatRoom />} />
          <Route path="/home" element={<Homee />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
