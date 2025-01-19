import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";

interface Event {
  date: string;
  name: string;
  description: string;
}

const CryptoCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock data for events (replace with actual API data)
  useEffect(() => {
    const mockEvents = [
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

    setEvents(mockEvents); // Set mock data to events
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="crypto-calendar bg-[#121212] text-white py-12 px-8 rounded-xl shadow-xl max-w-6xl mx-auto mt-16">
      <h2 className="text-4xl font-bold mb-10 text-center text-gradient">
        <FaCalendarAlt className="inline mr-4" size={40} /> Crypto Calendar
      </h2>

      <div className="calendar-container flex flex-col lg:flex-row items-start justify-between">
        {/* Calendar */}
        <div className="calendar w-full lg:w-1/3 mb-10 lg:mb-0">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="rounded-lg shadow-xl border-2 border-[#333333] hover:border-[#0062cc] transition-all p-4"
          />
        </div>

        {/* Events List */}
        <div className="events-list w-full lg:w-2/3 p-8 bg-[#1d1d1d] rounded-lg shadow-xl">
          {filteredEvents.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-8 text-3xl text-[#4CAF50]">
                <FaRegCalendarCheck className="inline mr-4" size={30} />
                Events on {selectedDate.toDateString()}:
              </h3>
              <ul className="space-y-6">
                {filteredEvents.map((event, index) => (
                  <li
                    key={index}
                    className="p-8 bg-[#292929] rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    <h4 className="font-semibold text-2xl text-[#00bcd4]">{event.name}</h4>
                    <p className="text-lg text-gray-300 mt-2">{event.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-lg text-gray-400">No events on this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoCalendar;
