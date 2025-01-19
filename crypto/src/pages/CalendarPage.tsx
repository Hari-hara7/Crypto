import React from "react";
import CryptoCalendar from "../components/CryptoCalendar"; // Import the component

const CalendarPage: React.FC = () => {
  return (
    <div className="calendar-page bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen flex flex-col items-center py-16">
      <div className="max-w-6xl w-full px-6">
        <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-8">
          Crypto Events Calendar
        </h1>

        {/* Crypto Calendar Component */}
        <CryptoCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;
