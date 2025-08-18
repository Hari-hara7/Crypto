import { FC, useEffect, useState } from "react";
import { fetchNews } from "../services/api";
import { News } from "../services/types";
import { motion } from "framer-motion";
import { 
  FaExternalLinkAlt, 
  FaNewspaper, 
  FaCalendarAlt, 
  FaUser, 
  FaFire,
  FaSearch,
  FaEye,
  FaClock
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const NewsFeed: FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const newsPerPage = 6;

  // Particles configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "#0d1117" } },
    particles: {
      color: { value: "#00FFCC" },
      links: { enable: true, color: "#00FFCC", distance: 150 },
      move: { enable: true, speed: 1.5 },
      size: { value: { min: 1, max: 4 } },
      opacity: { value: { min: 0.3, max: 0.7 } },
    },
  };

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      try {
        const data = await fetchNews();
        setNews(data.Data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      const data = await fetchNews();
      setNews(data.Data || []);
    } catch (error) {
      console.error("Error refreshing news:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * newsPerPage,
    currentPage * newsPerPage
  );

  const formatTimeAgo = (publishedOn: number) => {
    const now = Date.now() / 1000;
    const diffSeconds = now - publishedOn;
    const diffHours = Math.floor(diffSeconds / 3600);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen relative">
      {/* Particles Background */}
      <Particles
        id="tsparticles-newsfeed"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 h-full w-full z-0"
      />

      <div className="relative z-10 p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 drop-shadow-lg mb-6">
            <FaFire className="inline-block mr-3 text-teal-400" />
            Crypto News Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Stay updated with the latest cryptocurrency news and market insights from around the world.
          </p>

          {/* Search and Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:outline-none w-64"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="altcoins">Altcoins</option>
              <option value="defi">DeFi</option>
              <option value="nft">NFT</option>
            </select>

            <motion.button
              onClick={refreshNews}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`${refreshing ? 'animate-spin' : ''}`}>
                <FiRefreshCw />
              </div>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* News Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          <NewsStatCard
            icon={<FaNewspaper className="text-teal-400 text-3xl" />}
            title="Total Articles"
            value={filteredNews.length.toString()}
            subtitle="Available Stories"
          />
          <NewsStatCard
            icon={<FaClock className="text-cyan-400 text-3xl" />}
            title="Fresh Content"
            value={filteredNews.filter(item => {
              const hoursSincePublished = (Date.now() / 1000 - item.published_on) / 3600;
              return hoursSincePublished < 24;
            }).length.toString()}
            subtitle="Last 24 Hours"
          />
          <NewsStatCard
            icon={<FaEye className="text-blue-400 text-3xl" />}
            title="Categories"
            value="6"
            subtitle="News Sources"
          />
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent"></div>
            <span className="ml-4 text-xl text-teal-400">Loading latest news...</span>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
              {paginatedNews.map((item, index) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  index={index}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center space-x-4 mt-8"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-teal-400 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-teal-400 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}

            {/* No Results */}
            {filteredNews.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <FaSearch className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No news found</h3>
                <p className="text-gray-500">Try adjusting your search terms or check back later</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// News Stat Card Component
const NewsStatCard: FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}> = ({ icon, title, value, subtitle }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-teal-400 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div>{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-teal-400 mb-2">{value}</div>
    <div className="text-sm text-gray-400">{subtitle}</div>
  </motion.div>
);

// News Card Component
const NewsCard: FC<{
  news: News;
  index: number;
  formatTimeAgo: (publishedOn: number) => string;
}> = ({ news, index, formatTimeAgo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-teal-400 transition-all duration-300 overflow-hidden group"
  >
    {/* News Image Placeholder */}
    <div className="h-48 bg-gradient-to-r from-teal-500 to-cyan-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
      <div className="absolute bottom-4 left-4">
        <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {formatTimeAgo(news.published_on)}
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <FaClock className="text-white text-lg" />
      </div>
    </div>

    {/* News Content */}
    <div className="p-6">
      <div className="flex items-center mb-3 text-sm text-gray-400">
        <FaUser className="mr-2" />
        <span>{news.source || 'Crypto News'}</span>
        <span className="mx-2">•</span>
        <FaCalendarAlt className="mr-2" />
        <span>{new Date(news.published_on * 1000).toLocaleDateString()}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-teal-400 transition-colors">
        {news.title}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {news.body}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaEye />
          <span>Read more</span>
        </div>
        
        <motion.a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Read Full Article</span>
          <FaExternalLinkAlt />
        </motion.a>
      </div>
    </div>
  </motion.div>
);

export default NewsFeed;
