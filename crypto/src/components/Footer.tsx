import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineStock,
  AiOutlineCalculator,
  AiOutlineCalendar,
  AiOutlineRead,
  AiOutlineRobot,
  AiOutlineGithub,
  AiOutlineTwitter,
  AiOutlineLinkedin,
  AiOutlineInstagram
} from "react-icons/ai";
import {
  FaCoins,
  FaRegNewspaper,
  FaUserCircle,
  FaBitcoin,
  FaChevronUp,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaCopy
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { BsDiscord } from "react-icons/bs";

const Footer: FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navigationItems = {
    main: [
      { icon: <AiOutlineHome />, label: "Home", to: "/" },
      { icon: <FaCoins />, label: "Coins", to: "/coins" },
      { icon: <AiOutlineCalculator />, label: "Converter", to: "/converter" },
      { icon: <FaRegNewspaper />, label: "News", to: "/news" },
    ],
    tools: [
      { icon: <AiOutlineStock />, label: "Compare", to: "/compare" },
      { icon: <AiOutlineCalendar />, label: "Calendar", to: "/calendar" },
      { icon: <AiOutlineRead />, label: "Learn", to: "/learn" },
      { icon: <AiOutlineRobot />, label: "AI Prediction", to: "/predict" },
    ],
    account: [
      { icon: <FaUserCircle />, label: "Sign In", to: "/auth" },
      { icon: <FaShieldAlt />, label: "Privacy", to: "/privacy" },
      { icon: <FaRocket />, label: "Premium", to: "/premium" },
    ]
  };

  const socialLinks = [
    { icon: <AiOutlineGithub />, label: "GitHub", url: "https://github.com/Hari-hara7", color: "hover:text-gray-300" },
    { icon: <AiOutlineTwitter />, label: "Twitter", url: "https://x.com/Hariharana70309?t=Ib05QY4zN8F41MsLHAix5Q&s=09", color: "hover:text-blue-400" },
    { icon: <AiOutlineLinkedin />, label: "LinkedIn", url: "https://www.linkedin.com/in/hari-hara-nath-a13583282/", color: "hover:text-blue-500" },
    { icon: <BsDiscord />, label: "Discord", url: "https://discord.gg/EVbcRNpP", color: "hover:text-indigo-400" },

    { icon: <AiOutlineInstagram />, label: "Instagram", url: "https://instagram.com/hari_hara_nath77", color: "hover:text-pink-400" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('Hariharanath247@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-50 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-xl border border-gray-600 transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <FaChevronUp className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}

      <footer className="bg-gray-900 text-gray-100 border-t border-gray-700 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 lg:py-12">
          {}
          <div className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
            
            {}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="mb-4 md:mb-6 lg:mb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 md:p-2 rounded-lg">
                    <FaBitcoin className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">
                    Crypto Tracker
                  </h2>
                </div>
                <p className="text-gray-400 text-xs md:text-sm lg:text-base leading-relaxed max-w-sm md:max-w-md mx-auto lg:mx-0 px-2 lg:px-0">
                  Your complete gateway to cryptocurrency tracking and analysis. Real-time data, secure platform, and comprehensive tools for modern crypto enthusiasts.
                </p>
              </div>

              {}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6 lg:mb-8 max-w-sm mx-auto lg:max-w-none lg:mx-0">
                {[
                  { icon: <FaRocket />, text: "Real-time", subtext: "Live data updates" },
                  { icon: <FaShieldAlt />, text: "Secure", subtext: "Protected platform" },
                  { icon: <FaBitcoin />, text: "Multi-coin", subtext: "All cryptocurrencies" }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-2 md:p-3 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <span className="text-teal-400 text-base md:text-lg">{feature.icon}</span>
                      <span className="text-white text-xs md:text-sm font-medium">{feature.text}</span>
                      <span className="text-gray-500 text-xs hidden md:block">{feature.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
                  Connect With Us
                </h4>
                <div className="flex justify-center lg:justify-start space-x-2 md:space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center p-2.5 md:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 border border-gray-700 hover:border-teal-500/50 hover:scale-105 ${social.color}`}
                      title={social.label}
                      aria-label={`Visit our ${social.label}`}
                    >
                      <span className="text-sm md:text-base group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                
                {}
                <div className="bg-gray-800/30 p-3 md:p-4 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start space-x-2">
                    <AiOutlineHome className="text-teal-400 text-base md:text-lg" />
                    <span>Main</span>
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2">
                    {navigationItems.main.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 text-xs md:text-sm py-1.5 px-2 rounded hover:bg-gray-700/50"
                        >
                          <span className="text-teal-400 group-hover:text-teal-300 text-sm md:text-base">{item.icon}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-300">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {}
                <div className="bg-gray-800/30 p-3 md:p-4 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start space-x-2">
                    <AiOutlineCalculator className="text-teal-400 text-base md:text-lg" />
                    <span>Tools</span>
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2">
                    {navigationItems.tools.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 text-xs md:text-sm py-1.5 px-2 rounded hover:bg-gray-700/50"
                        >
                          <span className="text-teal-400 group-hover:text-teal-300 text-sm md:text-base">{item.icon}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-300">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {}
                <div className="bg-gray-800/30 p-3 md:p-4 rounded-lg border border-gray-700/50 sm:col-span-2 lg:col-span-1">
                  <h4 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start space-x-2">
                    <FaUserCircle className="text-teal-400 text-base md:text-lg" />
                    <span>Account</span>
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2">
                    {navigationItems.account.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 text-xs md:text-sm py-1.5 px-2 rounded hover:bg-gray-700/50"
                        >
                          <span className="text-teal-400 group-hover:text-teal-300 text-sm md:text-base">{item.icon}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-300">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {}
            <div className="lg:col-span-3">
              <h4 className="text-sm md:text-base lg:text-lg font-semibold text-white mb-3 md:mb-4 text-center lg:text-left flex items-center justify-center lg:justify-start space-x-2">
                <FiMail className="text-teal-400 text-base md:text-lg" />
                <span>Get in Touch</span>
              </h4>

              <div className="space-y-2 md:space-y-3">
                {}
                <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500/30 transition-colors duration-300">
                      <FiMail className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                      <p className="text-white text-xs md:text-sm font-medium truncate">Hariharanath247@gmail.com</p>
                    </div>
                    <button
                      onClick={copyEmail}
                      className="flex-shrink-0 p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 group/btn"
                      title="Copy email"
                      aria-label="Copy email address"
                    >
                      {copiedEmail ? (
                        <span className="text-green-400 text-xs md:text-sm font-bold">✓</span>
                      ) : (
                        <FaCopy className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover/btn:text-white transition-colors duration-300" />
                      )}
                    </button>
                  </div>
                </div>

                {}
                <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                      <FiPhone className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                      <a 
                        href="tel:+917989777877" 
                        className="text-white hover:text-green-400 transition-colors duration-300 text-xs md:text-sm font-medium inline-flex items-center space-x-1 group/link"
                      >
                        <span>+91 7989777877</span>
                        <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {}
                <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                      <FiMapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Location</p>
                      <p className="text-white text-xs md:text-sm font-medium">India</p>
                    </div>
                  </div>
                </div>

                {}
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-lg border border-teal-500/20">
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-gray-300 mb-2">Stay updated with crypto trends</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors duration-300"
                      />
                      <button
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-300 whitespace-nowrap"
                        aria-label="Subscribe to newsletter"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="border-t border-gray-700/80 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-3 sm:px-4 py-3 md:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-400">
                <span>© {new Date().getFullYear()}</span>
                <span className="text-teal-400 font-semibold">Crypto Tracker</span>
                <span className="hidden sm:inline">• Made with</span>
                <FaHeart className="w-3 h-3 text-red-500 animate-pulse hidden sm:block" />
                <span className="hidden sm:inline">• All rights reserved</span>
              </div>
              
              {}
              <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</a>
                <span className="text-gray-600">•</span>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a>
                <span className="text-gray-600">•</span>
                <a href="/support" className="text-gray-400 hover:text-white transition-colors duration-300">Support</a>
              </div>
            </div>
            
            {}
            <div className="sm:hidden text-center mt-2 pt-2 border-t border-gray-700/50">
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <span>Made with</span>
                <FaHeart className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                <span>in India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
