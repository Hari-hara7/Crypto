import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import notificationIcon from "../assets/Screenshot 2025-01-19 183430.png";//crypto/src/assets/Screenshot 2025-01-19 183430.png

const socket = io("https://crypto-2-t0w6.onrender.com"); 

const CryptoNotification = () => {
  const [cryptoData, setCryptoData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Request Notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

 // Send browser notifications
 const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: notificationIcon, // Use imported image as notification icon
      });
    }
  };

  // Connect to the backend and listen for updates
  useEffect(() => {
    socket.on("cryptoUpdate", (data) => {
      setCryptoData(data);
      setIsLoading(false);

      // Trigger notifications
      if (data.bitcoin && data.ethereum) {
        sendNotification(
          "Crypto Update 🚀",
          `Bitcoin: $${data.bitcoin.usd}, Ethereum: $${data.ethereum.usd}`
        );
      }
    });

    return () => {
      socket.off("cryptoUpdate");
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Crypto Updates</h1>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Bitcoin (BTC):</h2>
              <p>${cryptoData.bitcoin.usd}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ethereum (ETH):</h2>
              <p>${cryptoData.ethereum.usd}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoNotification;
