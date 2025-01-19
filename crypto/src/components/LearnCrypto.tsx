import React from "react";
import { FaBook, FaVideo, FaFileAlt, FaChartLine } from "react-icons/fa"; // Icons for resources

const LearnCrypto: React.FC = () => {
  return (
    <div className="learn-crypto bg-[#121212] text-white py-16 px-8 rounded-xl shadow-xl min-h-screen flex flex-col justify-center">
      <div className="container max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-12 text-gradient">
          Learn Crypto Like a Pro
        </h2>

        <div className="resources-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Resource 1: Articles */}
          <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
            <div className="icon mb-4 text-4xl text-[#ff9800]">
              <FaBook />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Crypto Articles</h3>
            <p className="text-lg text-gray-300 mb-6">
              Dive into well-researched articles covering the fundamentals, news, and trends in the crypto world.
            </p>
            <a
              href="https://www.coindesk.com/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-learn-more text-[#0062cc] hover:underline font-medium"
            >
              Read Articles
            </a>
          </div>

          {/* Resource 2: Videos */}
          <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
            <div className="icon mb-4 text-4xl text-[#4caf50]">
              <FaVideo />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Crypto Videos</h3>
            <p className="text-lg text-gray-300 mb-6">
              Watch expert videos and tutorials to understand the concepts of blockchain and cryptocurrency.
            </p>
            <a
              href="https://www.youtube.com/results?search_query=cryptocurrency+beginner+guide"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-learn-more text-[#0062cc] hover:underline font-medium"
            >
              Watch Videos
            </a>
          </div>

          {/* Resource 3: PDFs/Guides */}
          <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
            <div className="icon mb-4 text-4xl text-[#ff4081]">
              <FaFileAlt />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Crypto Guides</h3>
            <p className="text-lg text-gray-300 mb-6">
              Download free guides and PDFs for a deeper understanding of the crypto markets and trading strategies.
            </p>
            <a
              href="https://www.investopedia.com/terms/c/cryptocurrency.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-learn-more text-[#0062cc] hover:underline font-medium"
            >
              Download Guides
            </a>
          </div>

          {/* Resource 4: Charts/Analytics */}
          <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
            <div className="icon mb-4 text-4xl text-[#00bcd4]">
              <FaChartLine />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Crypto Analytics</h3>
            <p className="text-lg text-gray-300 mb-6">
              Explore real-time charts and analytics to track cryptocurrency price movements and market trends.
            </p>
            <a
              href="https://www.coingecko.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-learn-more text-[#0062cc] hover:underline font-medium"
            >
              Explore Charts
            </a>
          </div>
        </div>

        <div className="additional-resources mt-16">
          <h3 className="text-3xl font-semibold mb-8 text-center text-gradient">More Learning Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
              <h4 className="text-xl font-semibold text-[#ff9800] mb-4">Crypto Glossary</h4>
              <p className="text-lg text-gray-300">
                Explore the glossary of common crypto terms and jargon to build your vocabulary.
              </p>
              <a
                href="https://www.coinbase.com/learn/crypto-basics/what-is-cryptocurrency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0062cc] hover:underline mt-4 inline-block"
              >
                Learn More
              </a>
            </div>

            <div className="resource-card bg-[#1d1d1d] p-8 rounded-xl shadow-lg hover:scale-105 transition-all transform">
              <h4 className="text-xl font-semibold text-[#4caf50] mb-4">Crypto Podcasts</h4>
              <p className="text-lg text-gray-300">
                Tune in to the best crypto podcasts to hear from industry experts and stay updated on trends.
              </p>
              <a
                href="https://www.coindesk.com/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0062cc] hover:underline mt-4 inline-block"
              >
                Listen Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCrypto;
