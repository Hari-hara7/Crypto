import { FC } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineStock, AiOutlineCalculator, AiOutlineCalendar, AiOutlineRead, AiOutlineRobot } from "react-icons/ai";
import { FaCoins, FaRegNewspaper, FaUserCircle } from "react-icons/fa";

const Footer: FC = () => (
  <footer className="bg-gray-900 text-gray-300 py-10 px-6">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* About Section */}
      <div>
        <h3 className="text-lg font-semibold text-teal-400 mb-4">About Crypto Tracker</h3>
        <p>
          Crypto Tracker provides accurate and real-time cryptocurrency data, market trends, and comparisons to help
          users make informed decisions in the fast-evolving crypto market.
        </p>
      </div>

      {/* Quick Links Section */}
      <div>
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <AiOutlineHome className="text-teal-400" />
            <Link to="/" className="hover:text-teal-400 transition duration-300">Home</Link>
          </li>
          <li className="flex items-center gap-2">
            <FaCoins className="text-teal-400" />
            <Link to="/coins" className="hover:text-teal-400 transition duration-300">Coins</Link>
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineCalculator className="text-teal-400" />
            <Link to="/converter" className="hover:text-teal-400 transition duration-300">Converter</Link>
          </li>
          <li className="flex items-center gap-2">
            <FaRegNewspaper className="text-teal-400" />
            <Link to="/news" className="hover:text-teal-400 transition duration-300">News</Link>
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineStock className="text-teal-400" />
            <Link to="/compare" className="hover:text-teal-400 transition duration-300">Compare</Link>
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineCalendar className="text-teal-400" />
            <Link to="/calendar" className="hover:text-teal-400 transition duration-300">Crypto Calendar</Link>
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineRead className="text-teal-400" />
            <Link to="/learn" className="hover:text-teal-400 transition duration-300">Learn Crypto</Link>
          </li>
          <li className="flex items-center gap-2">
            <AiOutlineRobot className="text-teal-400" />
            <Link to="/chatbot" className="hover:text-teal-400 transition duration-300">Chatbot</Link>
          </li>
          <li className="flex items-center gap-2">
            <FaUserCircle className="text-teal-400" />
            <Link to="/Auth" className="hover:text-teal-400 transition duration-300">Signin</Link>
          </li>
        </ul>
      </div>

      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Contact Us</h3>
        <p>
          Have questions? Reach out to us at:
        </p>
        <p className="mt-2">
          Email: <a href="mailto:support@cryptotracker.com" className="hover:text-teal-400">Hariharanath247@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+1234567890" className="hover:text-teal-400">+91 7989777877</a>
        </p>
      </div>
    </div>

    <div className="border-t border-gray-700 mt-8 pt-4 text-center">
      <p>© {new Date().getFullYear()} Crypto Tracker. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
