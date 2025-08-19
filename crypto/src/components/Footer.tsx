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
import { BsDiscord, BsTelegram } from "react-icons/bs";

const Footer: FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Navigation items organized by category
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
      { icon: <AiOutlineRobot />, label: "AI Chat", to: "/chatbot" },
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

  // Check scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 p-3 bg-gray hover:bg-gray-600 text-white rounded-full shadow-lg border border-gray-600 transition-colors duration-300"
        >
          <FaChevronUp className="w-5 h-5" />
        </button>
      )}

      <footer className="bg-gray-900 text-gray-100 border-t border-gray-700">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Mobile-First Layout */}
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
            
            {/* Brand Section - Full width on mobile */}
            <div className="lg:col-span-5">
              <div className="text-center lg:text-left mb-6 lg:mb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                  <div className="relative">
                    <FaBitcoin className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white">
                    Crypto Tracker
                  </h2>
                </div>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                  Your gateway to cryptocurrency tracking and analysis. Real-time data, secure platform, and comprehensive tools.
                </p>
              </div>

              {/* Features - Mobile optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 lg:mb-8">
                {[
                  { icon: <FaRocket />, text: "Real-time data" },
                  { icon: <FaShieldAlt />, text: "Secure platform" },
                  { icon: <FaBitcoin />, text: "Multi-currency" }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-300 justify-center lg:justify-start"
                  >
                    <span className="text-teal-400 text-lg">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links - Mobile optimized */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 text-center lg:text-left">
                  Connect With Us
                </h4>
                <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto lg:mx-0">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-300 ${social.color}`}
                      title={social.label}
                    >
                      <span className="text-base">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation - Better mobile layout */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-4">
                
                {/* Main Navigation */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 text-center sm:text-left">
                    Main
                  </h4>
                  <ul className="space-y-2">
                    {navigationItems.main.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm py-1"
                        >
                          <span className="text-teal-400">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 text-center sm:text-left">
                    Tools
                  </h4>
                  <ul className="space-y-2">
                    {navigationItems.tools.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm py-1"
                        >
                          <span className="text-teal-400">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Account */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 text-center sm:text-left">
                    Account
                  </h4>
                  <ul className="space-y-2">
                    {navigationItems.account.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm py-1"
                        >
                          <span className="text-teal-400">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section - Mobile friendly */}
            <div className="lg:col-span-3">
              <h4 className="text-lg font-semibold text-white mb-4 text-center lg:text-left">
                Get in Touch
              </h4>

              <div className="space-y-3">
                {/* Email */}
                <div className="bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-white text-sm truncate">Hariharanath247@gmail.com</p>
                    </div>
                    <button
                      onClick={copyEmail}
                      className="p-1 hover:bg-gray-600 rounded transition-colors duration-300 flex-shrink-0"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <span className="text-green-400 text-xs">✓</span>
                      ) : (
                        <FaCopy className="w-3 h-3 text-gray-400 hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiPhone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Phone</p>
                      <a 
                        href="tel:+917989777877" 
                        className="text-white hover:text-teal-400 transition-colors duration-300 text-sm"
                      >
                        +91 7989777877
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-white text-sm">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>© {new Date().getFullYear()}</span>
                <span className="text-teal-400 font-semibold">Crypto Tracker</span>
                <span>• Made with</span>
                <FaHeart className="w-3 h-3 text-red-500" />
                <span>• All rights reserved</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
