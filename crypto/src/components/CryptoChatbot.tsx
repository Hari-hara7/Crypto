import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaBitcoin, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const CryptoPricePage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; text: string; date: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to dark mode
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Function to get cryptocurrency data
  const getCryptoData = async (coin: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );

      const currentDate = new Date().toLocaleString();

      // If the coin is not found
      if (!response.data[coin]) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "system", text: `Sorry, I couldn't find the price of ${coin}. Please make sure the coin name is correct.`, date: currentDate },
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
        { sender: "system", text: "Sorry, there was an error fetching the data.", date: currentDate },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle user input and get response
  const handleUserInput = () => {
    if (userInput.trim() === "") {
      return;
    }

    const currentDate = new Date().toLocaleString();

    // Add user's message to the interface
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput, date: currentDate },
    ]);

    // Extract the coin name from the input (e.g., "What is the price of bitcoin?" => "bitcoin")
    const coin = extractCoinName(userInput);
    if (coin) {
      getCryptoData(coin);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "system", text: "Sorry, I couldn't understand the coin name. Please provide a valid cryptocurrency.", date: currentDate },
      ]);
    }

    setUserInput(""); // Clear input field
  };

  // Extract the coin name from a sentence
  const extractCoinName = (input: string): string | null => {
    const match = input.toLowerCase().match(/(?:price of|what is the price of|how much is)\s+(\w+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>      
      <div className="crypto-page-container max-w-2xl mx-auto pt-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaBitcoin className="mr-2 text-yellow-400" /> Cryptocurrency Price Checker
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-gray-300 focus:outline-none hover:shadow-lg"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </button>
        </header>
        <div className="interaction-box bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <div className="input-area flex items-center mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about a cryptocurrency (e.g., 'price of bitcoin')..."
              className="input-field p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUserInput}
              className="submit-button bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none flex items-center"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <FaBitcoin className="mr-2" /> Check
                </>
              )}
            </motion.button>
          </div>
          <div className="messages-container bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-[400px] overflow-auto">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`message-bubble mb-2 p-3 rounded-lg max-w-[80%] ${
                  message.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black dark:bg-gray-600 dark:text-white"
                }`}
              >
                <p className="flex items-center">
                  {message.sender === "user" ? <FaBitcoin className="mr-2" /> : <FaClock className="mr-2" />}
                  {message.text}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1 flex items-center">
                  <FaClock className="mr-1" /> {message.date}
                </span>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPricePage;
