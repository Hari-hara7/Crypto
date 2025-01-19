import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Crypto Tracker</h1>
          <p className="text-lg mb-6">
            Your one-stop solution for tracking cryptocurrency prices, market trends, and news.
          </p>
          <Link to="/coins">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition">
              Explore Cryptocurrencies
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Real-Time Prices</h3>
            <p className="text-gray-600">
              Stay updated with live cryptocurrency prices and market trends.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Currency Converter</h3>
            <p className="text-gray-600">
              Convert cryptocurrencies to fiat or other cryptocurrencies with ease.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Latest News</h3>
            <p className="text-gray-600">
              Stay informed with the latest cryptocurrency news and updates.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Advanced Filters</h3>
            <p className="text-gray-600">
              Sort and filter coins by price, volume, market cap, and more.
            </p>
          </div>
          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">User-Friendly Design</h3>
            <p className="text-gray-600">
              A sleek and responsive interface for a seamless user experience.
            </p>
          </div>
          {/* Feature 6 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Global Accessibility</h3>
            <p className="text-gray-600">
              View prices and news in multiple languages and currencies.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Dive In?</h2>
          <p className="text-lg mb-6">
            Explore live prices, track trends, and stay informed with Crypto Tracker.
          </p>
          <Link to="/news">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition">
              Get the Latest News
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
