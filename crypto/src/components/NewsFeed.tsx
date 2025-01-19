import { FC, useEffect, useState } from "react";
import { fetchNews } from "../services/api";
import { News } from "../services/types";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaNewspaper } from "react-icons/fa";

const NewsFeed: FC = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNews();
      setNews(data.Data);
    };
    getNews();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaNewspaper className="text-teal-400 text-3xl mr-3" />
        <h2 className="text-2xl font-bold">Latest News</h2>
      </div>

      {/* News Items */}
      <ul className="space-y-6">
        {news.slice(0, 5).map((item) => (
          <motion.li
            key={item.id}
            className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-700 hover:border-teal-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 font-semibold flex items-center space-x-2 hover:underline"
            >
              <span>{item.title}</span>
              <FaExternalLinkAlt className="text-sm" />
            </a>
            <p className="text-gray-400 text-sm mt-2">{item.body}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
