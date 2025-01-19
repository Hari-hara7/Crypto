import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css"; // Calendar base styling

interface Event {
  date: string;
  name: string;
  description: string;
}

const CryptoCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const mockEvents: Event[] = [
      {
        date: "2025-01-19",
        name: "Bitcoin Halving",
        description: "Bitcoin halving event will happen today, reducing block rewards.",
      },
      {
        date: "2025-01-25",
        name: "Ethereum 2.0 Update",
        description: "Ethereum 2.0 update will improve scalability and security.",
      },
      {
        date: "2025-02-10",
        name: "Crypto Conference 2025",
        description: "The Crypto Conference 2025 will feature discussions from industry leaders.",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="crypto-calendar container mx-auto py-12 px-6">
      {/* Title Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">
          <FaCalendarAlt className="inline-block mr-2" />
          Cryptocurrency Calendar
        </h1>
        <p className="mt-4 text-gray-400">
          Stay updated with upcoming cryptocurrency events. Select a date to view details.
        </p>
      </motion.div>

      {/* Calendar and Events */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Calendar Section */}
        <motion.div
          className="calendar bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg w-full lg:w-1/3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-teal-400 mb-4">
            Select a Date
          </h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-lg border-none text-gray-300 custom-calendar"
          />
        </motion.div>

        {/* Events Section */}
        <motion.div
          className="events-list bg-gray-900 p-6 rounded-lg shadow-lg w-full lg:w-2/3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {filteredEvents.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-6">
                <FaRegCalendarCheck className="inline-block mr-2" />
                Events on {selectedDate.toDateString()}:
              </h3>
              <ul className="space-y-6">
                {filteredEvents.map((event, index) => (
                  <li
                    key={index}
                    className="p-6 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <h4 className="text-lg font-bold text-blue-400">
                      {event.name}
                    </h4>
                    <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              No events available for this date.
            </p>
          )}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button className="py-3 px-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Discover More Events
        </button>
      </motion.div>
    </div>
  );
};

export default CryptoCalendar;
