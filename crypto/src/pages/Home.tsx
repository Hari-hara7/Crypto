import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUserShield,
  FaChartLine,
  FaMobileAlt,
  FaComments,
  FaSyncAlt,
  FaPlay,
  FaInfoCircle,
} from "react-icons/fa";

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Take Control of Your Crypto Journey
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300">
            Experience the ultimate crypto tracking platform designed to keep you informed and ahead in the game.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {/* Primary Button */}
            <motion.button
              className="flex items-center bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-lg transition duration-300 gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <FaPlay className="text-lg" />
              Get Started Now
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 px-6 rounded-lg text-lg font-medium shadow-lg transition duration-300 gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaInfoCircle className="text-lg" />
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800">
        <motion.h2
          className="text-4xl font-bold text-center text-teal-400 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaRocket className="text-blue-400 text-5xl" />}
            title="Live Market Data"
            description="Get instant updates on cryptocurrency prices and trends."
          />
          <FeatureCard
            icon={<FaChartLine className="text-teal-400 text-5xl" />}
            title="Portfolio Insights"
            description="Monitor your investments with intuitive performance analysis tools."
          />
          <FeatureCard
            icon={<FaMobileAlt className="text-green-400 text-5xl" />}
            title="Cross-Platform Access"
            description="Stay connected on desktop, tablet, or mobile seamlessly."
          />
          <FeatureCard
            icon={<FaUserShield className="text-yellow-400 text-5xl" />}
            title="Secure Platform"
            description="Your data and transactions are encrypted for maximum security."
          />
          <FeatureCard
            icon={<FaComments className="text-purple-400 text-5xl" />}
            title="Expert Community"
            description="Engage with professionals and enthusiasts to refine your strategies."
          />
          <FeatureCard
            icon={<FaSyncAlt className="text-pink-400 text-5xl" />}
            title="Auto Sync"
            description="Sync your account and data across devices for effortless management."
          />
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-gray-900">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-teal-400 mb-8">About Us</h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            At <span className="text-teal-400 font-bold">Crypto Tracker</span>, we simplify cryptocurrency management for everyone. Whether you're a novice investor or a seasoned trader, our platform provides tools, insights, and security to succeed in the dynamic world of crypto.
          </p>
          <p className="text-gray-300 text-lg md:text-xl mt-6 leading-relaxed">
            Empowering individuals with reliable data, user-friendly features, and a supportive community, we help you navigate the complexities of cryptocurrency with confidence.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

// FeatureCard Component
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-gray-900 p-6 rounded-lg shadow-md text-center border-2 border-transparent hover:border-gradient-to-r hover:from-teal-400 hover:via-blue-400 hover:to-purple-400 hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-teal-400">{title}</h3>
    <p className="text-gray-400 mt-2">{description}</p>
  </motion.div>
);

export default Home;
