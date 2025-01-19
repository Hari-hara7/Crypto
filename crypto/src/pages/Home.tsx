import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaBitcoin, FaWallet, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import { Link } from "react-router-dom";



const Home: React.FC = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "#0d1117" } },
    particles: {
      color: { value: "#00FFCC" }, // Teal particles
      links: { enable: true, color: "#00FFCC", distance: 150 },
      move: { enable: true, speed: 1.5 },
      size: { value: { min: 1, max: 4 } },
      opacity: { value: { min: 0.3, max: 0.7 } },
    },
  };

  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLElement;

    const updateCursorPosition = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      cursor.style.left = `${mouseX - cursor.offsetWidth / 2}px`;
      cursor.style.top = `${mouseY - cursor.offsetHeight / 2}px`;
    };

    const hoverElements = document.querySelectorAll(".hover-target");
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("active"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });

    window.addEventListener("mousemove", updateCursorPosition);
    return () => window.removeEventListener("mousemove", updateCursorPosition);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen">
      {/* Custom Cursor */}
      <div className="cursor">
        <FaBitcoin className="cursor-icon text-teal-400" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center relative">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute top-0 left-0 h-full w-full"
        />
        <motion.div
          className="max-w-4xl z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
            Welcome to Crypto World
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300">
            Learn, invest, and explore the future of digital currencies.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
  <Link to="/coins">
    <motion.button
      className="flex items-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-lg transition duration-300 gap-2 hover-target"
    >
      <FiArrowRight className="text-white mr-2" />
      Get Started
    </motion.button>
  </Link>

  <Link to="/compare">
    <motion.button
      className="flex items-center bg-gray-700 hover:bg-teal-700 text-teal-400 py-3 px-6 rounded-lg text-lg font-medium shadow-lg transition duration-300 gap-2 hover-target"
    >
      <FiInfo className="text-teal-400 mr-2" />
      Learn More
    </motion.button>
  </Link>
</div>

        </motion.div>
      </section>

      {/* About Cryptocurrency Section */}
      <section className="py-20 px-6 bg-gray-900">
        <motion.h2
          className="text-4xl font-bold text-center text-teal-400 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What is Cryptocurrency?
        </motion.h2>
        <div className="max-w-5xl mx-auto text-center text-gray-300">
          <p className="text-lg mb-6">
            Cryptocurrency is a decentralized digital currency secured by cryptography, making it nearly impossible to counterfeit or double-spend. 
          </p>
          <p className="text-lg">
            It operates on blockchain technology, enabling transparent and secure transactions worldwide.
          </p>
        </div>
      </section>

      {/* Market Trends Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-800 to-gray-900">
        <motion.h2
          className="text-4xl font-bold text-center text-teal-400 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Market Trends
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <MarketCard
            icon={<FaBitcoin className="text-teal-400 text-5xl" />}
            title="Bitcoin"
            description="The largest and most well-known cryptocurrency with a growing market value."
          />
          <MarketCard
            icon={<FaWallet className="text-teal-400 text-5xl" />}
            title="Ethereum"
            description="A leading blockchain platform powering smart contracts and DApps."
          />
          <MarketCard
            icon={<FaGlobe className="text-teal-400 text-5xl" />}
            title="Altcoins"
            description="Emerging alternatives to Bitcoin with unique features and potential."
          />
        </div>
      </section>

      {/* Benefits of Cryptocurrency Section */}
      <section className="py-20 px-6 bg-gray-800">
        <motion.h2
          className="text-4xl font-bold text-center text-teal-400 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Cryptocurrency?
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <FeatureCard
            icon={<FaShieldAlt className="text-teal-400 text-5xl" />}
            title="Secure Transactions"
            description="Blockchain ensures secure, transparent, and tamper-proof transactions."
          />
          <FeatureCard
            icon={<FaBitcoin className="text-teal-400 text-5xl" />}
            title="Decentralized"
            description="Eliminates the need for intermediaries, offering direct peer-to-peer interactions."
          />
          <FeatureCard
            icon={<FaGlobe className="text-teal-400 text-5xl" />}
            title="Global Reach"
            description="Cryptocurrencies enable borderless transactions across the world."
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-center">
        <h2 className="text-4xl font-bold text-teal-400 mb-6">
          Ready to Join the Future?
        </h2>
        <p className="text-lg text-gray-300 mb-10">
          Start your cryptocurrency journey today. Invest, learn, and grow.
        </p>
        <Link to="/Auth">
  <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-8 rounded-lg text-lg font-medium shadow-lg transition duration-300 hover:from-teal-600 hover:to-teal-500 hover:shadow-xl">
    Join Now
  </button>
</Link>
      </section>
    </div>
  );
};

const MarketCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-gray-900 p-6 rounded-lg shadow-md text-center border-2 border-transparent hover:border-teal-400 hover:shadow-lg transition duration-300 transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-teal-400 mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-gray-900 p-6 rounded-lg shadow-md text-center border-2 border-transparent hover:border-teal-400 hover:shadow-lg transition duration-300 transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-teal-400 mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default Home;
