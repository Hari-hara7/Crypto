import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaBitcoin, FaWallet, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import { Link } from "react-router-dom";
import cryptoImage from '../assets/crypto.webp';//crypto/src/assets/crypto.webp
import cryptoImage1 from '../assets/crypto1.png';//crypto/src/assets/crypto.webpcrypto/src/assets/crypto1.png

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

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 drop-shadow-lg">
            
            Welcome to Crypto World <FaBitcoin className="inline-block mr-3 text-cyan-500" />
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-300">
            Learn, invest, and explore the future of digital currencies.
          </p>
          <div className="mt-10 flex flex-wrap sm:flex-nowrap justify-center gap-4">
  <Link to="/coins">
    <motion.button
      className="flex items-center justify-center bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-medium shadow-md transition duration-300 transform hover:scale-105 gap-2"
      whileHover={{ scale: 1.1 }}
    >
      <FiArrowRight className="text-white" />
      Get Started
    </motion.button>
  </Link>

  <Link to="/compare">
    <motion.button
      className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-cyan-400 py-2 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-medium shadow-md transition duration-300 transform hover:scale-105 gap-2"
      whileHover={{ scale: 1.1 }}
    >
      <FiInfo className="text-cyan-400" />
      Learn More
    </motion.button>
  </Link>
</div>


        </motion.div>
      </section>

      {/* About Cryptocurrency Section with Image */}
<section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
        {/* Text Content */}
        <div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Understanding <span className="text-teal-400">Cryptocurrency</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Cryptocurrency is a groundbreaking digital currency that leverages 
            <span className="text-teal-400"> blockchain technology</span> to operate securely and 
            independently of centralized financial institutions. It provides a borderless, transparent, 
            and efficient way to exchange value globally.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            By combining cryptographic security with decentralized systems, cryptocurrencies are 
            reshaping the financial landscape, offering unprecedented opportunities for 
            <span className="text-teal-400"> innovation</span> and empowerment.
          </p>
          
        </div>

        {/* Image Section */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-teal-500 blur-xl rounded-full opacity-20"></div>
          <img
            src={cryptoImage}
            alt="Cryptocurrency Illustration"
            className="relative z-10 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-600 blur-2xl rounded-full opacity-20"></div>
        </div>
      </div>
    </section>


    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
        {/* Image Section */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-teal-500 blur-xl rounded-full opacity-20"></div>
          <img
            src={cryptoImage1}
            alt="Cryptocurrency Illustration"
            className="relative z-10 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-600 blur-2xl rounded-full opacity-20"></div>
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Why <span className="text-teal-400">Blockchain</span> is the Future of Finance
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Blockchain is the revolutionary technology behind cryptocurrencies, offering a 
            decentralized, immutable ledger that ensures trust, transparency, and security in every transaction.
            It eliminates the need for traditional intermediaries, lowering transaction costs, and reducing the 
            potential for fraud.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Beyond cryptocurrencies, blockchain has the potential to transform industries such as supply chain, 
            healthcare, finance, and more. Its applications are limitless, and the potential for growth in this 
            space is vast, making it an exciting area to explore and invest in.
          </p>
          
        </div>
      </div>
    </section>

    <section className="py-20 px-6 sm:py-24 sm:px-8 lg:py-32 lg:px-12 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <motion.h2
    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-teal-400 mb-8 sm:mb-12 drop-shadow-lg"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    What is Cryptocurrency?
  </motion.h2>
  <div className="max-w-6xl mx-auto text-center text-gray-300 leading-relaxed px-4 sm:px-6 lg:px-8">
    <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
      Cryptocurrency is a decentralized digital currency secured by cryptography,
      making it nearly impossible to counterfeit or double-spend.
    </p>
    <p className="text-lg sm:text-xl lg:text-2xl">
      It operates on blockchain technology, enabling transparent and secure
      transactions worldwide.
    </p>
  </div>
</section>



{/* Market Trends Section */}
<section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <motion.h2
    className="text-5xl font-extrabold text-center text-teal-400 mb-16 drop-shadow-lg"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    Market Trends
  </motion.h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
    <MarketCard
      icon={<FaBitcoin className="text-teal-400 text-6xl mb-4" />}
      title="Bitcoin"
      description="The largest and most well-known cryptocurrency with a growing market value."
    />
    <MarketCard
      icon={<FaWallet className="text-teal-400 text-6xl mb-4" />}
      title="Ethereum"
      description="A leading blockchain platform powering smart contracts and DApps."
    />
    <MarketCard
      icon={<FaGlobe className="text-teal-400 text-6xl mb-4" />}
      title="Altcoins"
      description="Emerging alternatives to Bitcoin with unique features and potential."
    />
  </div>
</section>



     {/* Benefits of Cryptocurrency Section */}
<section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <motion.h2
    className="text-4xl font-extrabold text-center text-teal-400 mb-16 drop-shadow-lg"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    Why Choose Cryptocurrency?
  </motion.h2>

  {/* Features Grid */}
  {/* Features Grid */}
<div className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center text-white mb-12">
      Key <span className="text-teal-400">Features</span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <FeatureCard
        icon={<FaShieldAlt className="text-teal-400 text-6xl mb-4" />}
        title="Secure Transactions"
        description="Blockchain ensures secure, transparent, and tamper-proof transactions."
        bg="bg-gray-800"
      />
      <FeatureCard
        icon={<FaBitcoin className="text-teal-400 text-6xl mb-4" />}
        title="Decentralized"
        description="Eliminates the need for intermediaries, offering direct peer-to-peer interactions."
        bg="bg-gray-800"
      />
      <FeatureCard
        icon={<FaGlobe className="text-teal-400 text-6xl mb-4" />}
        title="Global Reach"
        description="Cryptocurrencies enable borderless transactions across the world."
        bg="bg-gray-800"
      />
    </div>
  </div>
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