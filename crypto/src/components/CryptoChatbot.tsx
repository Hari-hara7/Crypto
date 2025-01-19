import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaBitcoin, FaUser, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

const CryptoPricePage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; text: string; date: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getCryptoData = async (coin: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );
      const currentDate = new Date().toLocaleString();

      if (!response.data[coin]) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "system", text: `Sorry, I couldn't find the price of ${coin}.`, date: currentDate },
        ]);
      } else {
        const price = response.data[coin].usd;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "system", text: `The current price of ${coin} is $${price}.`, date: currentDate },
        ]);
      }
    } catch (error) {
      const currentDate = new Date().toLocaleString();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "system", text: "An error occurred while fetching the data. Please try again.", date: currentDate },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserInput = () => {
    if (!userInput.trim()) return;

    const currentDate = new Date().toLocaleString();
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput, date: currentDate },
    ]);

    const coin = extractCoinName(userInput);
    if (coin) {
      getCryptoData(coin);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "system", text: "Please specify a valid cryptocurrency.", date: currentDate },
      ]);
    }

    setUserInput("");
  };

  const extractCoinName = (input: string): string | null => {
    const match = input.toLowerCase().match(/(?:price of|what is the price of|how much is)\s+(\w+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} h-screen flex flex-col`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold flex items-center">
          <FaBitcoin className="mr-2 text-yellow-400" /> CryptoGPT
        </h1>
        <button onClick={toggleDarkMode} className="p-2 rounded-full">
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start mb-4 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-orange-400 to-yellow-500"
              }`}
            >
              {message.sender === "user" ? (
                <FaUser className="text-white text-xl" />
              ) : (
                <FaRobot className="text-white text-xl" />
              )}
            </div>
            {/* Message Bubble */}
            <div
              className={`max-w-sm p-3 rounded-lg shadow ${
                message.sender === "user"
                  ? "bg-blue-500 text-white ml-4"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mr-4"
              }`}
            >
              <p>{message.text}</p>
              <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">{message.date}</span>
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about a cryptocurrency (e.g., 'price of bitcoin')..."
            className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUserInput}
            className="ml-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CryptoPricePage;
