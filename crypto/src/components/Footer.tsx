import { FC } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineStock,
  AiOutlineCalculator,
  AiOutlineCalendar,
  AiOutlineRead,
  AiOutlineRobot
} from "react-icons/ai";
import {
  FaCoins,
  FaRegNewspaper,
  FaUserCircle
} from "react-icons/fa";

const Footer: FC = () => (
  <footer className="relative bg-gradient-to-tr from-black via-gray-900 to-black text-gray-300 py-16 px-6 overflow-hidden z-50">
    {/* Animated Glow Background Layer */}
    <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0f0f0f] opacity-60 blur-3xl z-0" />

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 relative z-10">

      {/* ABOUT */}
      <div className="glass-card">
        <h3 className="footer-title">About Crypto Tracker</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          A futuristic platform that keeps you ahead of the curve with real-time market data, analytics, and smart tools for your crypto journey.
        </p>
      </div>

      {/* QUICK LINKS */}
      <div className="glass-card">
        <h3 className="footer-title">Quick Links</h3>
        <ul className="space-y-3 text-sm">
          {[
            { icon: <AiOutlineHome />, label: "Home", to: "/" },
            { icon: <FaCoins />, label: "Coins", to: "/coins" },
            { icon: <AiOutlineCalculator />, label: "Converter", to: "/converter" },
            { icon: <FaRegNewspaper />, label: "News", to: "/news" },
            { icon: <AiOutlineStock />, label: "Compare", to: "/compare" },
            { icon: <AiOutlineCalendar />, label: "Crypto Calendar", to: "/calendar" },
            { icon: <AiOutlineRead />, label: "Learn Crypto", to: "/learn" },
            { icon: <AiOutlineRobot />, label: "Chatbot", to: "/chatbot" },
            { icon: <FaUserCircle />, label: "Signin", to: "/Auth" }
          ].map(({ icon, label, to }) => (
            <li key={label} className="flex items-center gap-3 group transition-transform hover:scale-105 duration-300">
              <span className="text-teal-400 group-hover:animate-pulse">{icon}</span>
              <Link to={to} className="text-gray-300 group-hover:text-yellow-400 transition-colors duration-300">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CONTACT */}
      <div className="glass-card">
        <h3 className="footer-title">Contact Us</h3>
        <p className="text-sm text-gray-400 mb-2">
          We'd love to hear from you. Reach out anytime.
        </p>
        <p className="text-sm">
          Email: <a href="mailto:Hariharanath247@gmail.com" className="text-teal-400 hover:text-yellow-400 transition duration-300">Hariharanath247@gmail.com</a>
        </p>
        <p className="text-sm">
          Phone: <a href="tel:+917989777877" className="text-teal-400 hover:text-yellow-400 transition duration-300">+91 7989777877</a>
        </p>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-800 pt-6 relative z-10">
      <p>
        © {new Date().getFullYear()} <span className="text-teal-400 font-semibold">Crypto Tracker</span>. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
