

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaRegCalendarCheck, 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaCalendarDay,
  FaChartLine,
  FaBell
} from "react-icons/fa";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth, db } from "../utils/firebaseConfig";
import { collection, onSnapshot, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import AddCryptoEventForm from "./AddCryptoEventForm";

interface EventItem {
  id?: string;
  title: string;
  description: string;
  link?: string;
  date: string;
  time?: string;
  category?: 'conference' | 'release' | 'update' | 'announcement' | 'other';
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  createdAt?: Date | null;
}

const CryptoCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [loading, setLoading] = useState(false);


  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    particles: {
      color: { value: "#00FFCC" },
      links: { 
        enable: true, 
        color: "#00FFCC", 
        distance: 150,
        opacity: 0.4
      },
      move: { enable: true, speed: 1.5 },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: { min: 0.3, max: 0.6 } },
      number: { value: 50 }
    },
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u?.email === "hariharanath247@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const fetched: EventItem[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as EventItem;
        fetched.push({ ...data, id: doc.id });
      });
      setAllEvents(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const q = query(collection(db, "events"), where("date", "==", dateStr));
    const unsub = onSnapshot(q, (snap) => {
      const fetched: EventItem[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as EventItem;
        fetched.push({ ...data, id: doc.id });
      });
      setEvents(fetched);
    });
    return () => unsub();
  }, [selectedDate]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'conference': return <FaCalendarDay className="text-blue-400" />;
      case 'release': return <FaChartLine className="text-green-400" />;
      case 'update': return <FaEdit className="text-yellow-400" />;
      case 'announcement': return <FaBell className="text-purple-400" />;
      default: return <FiCalendar className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-500/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(event => event.category === filterCategory);
    }

    return filtered;
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const hasEventsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return allEvents.some(event => event.date === dateStr);
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      <Particles
        id="tsparticles-calendar"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 h-full w-full"
      />
      
      <div className="relative z-10 container mx-auto py-10 px-4 sm:px-6">
        {}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            <FaCalendarAlt className="inline-block mr-4 text-teal-400" />
            Cryptocurrency Calendar
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay up-to-date with important cryptocurrency events, releases, and announcements.
          </p>
        </motion.div>

        {}
        <motion.div 
          className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="conference">Conferences</option>
                <option value="release">Releases</option>
                <option value="update">Updates</option>
                <option value="announcement">Announcements</option>
                <option value="other">Other</option>
              </select>
            </div>

            {}
            <div className="flex bg-gray-700/50 rounded-lg overflow-hidden">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as "month" | "week" | "day")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                    viewMode === mode
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
          </div>

          {}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaCalendarAlt className="text-2xl text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{allEvents.length}</div>
              <div className="text-sm text-gray-400">Total Events</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaRegCalendarCheck className="text-2xl text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{filteredEvents.length}</div>
              <div className="text-sm text-gray-400">Events Today</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaChartLine className="text-2xl text-teal-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {allEvents.filter(e => e.category === 'release').length}
              </div>
              <div className="text-sm text-gray-400">Releases</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaBell className="text-2xl text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {allEvents.filter(e => e.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-400">High Priority</div>
            </div>
          </div>
        </motion.div>

        {}
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-teal-400">Add New Event</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <AddCryptoEventForm onEventAdded={() => setShowAddForm(false)} />
            </motion.div>
          </motion.div>
        )}

        {}
        <div className="flex flex-col xl:flex-row gap-8">
          {}
          <motion.div 
            className="w-full xl:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-800/80 backdrop-blur-md border-gray-700 overflow-hidden">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-teal-400 text-xl flex items-center">
                  <FaCalendarAlt className="mr-3" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="calendar-wrapper">
                  <Calendar
                    onChange={(value) => setSelectedDate(value as Date)}
                    value={selectedDate}
                    className="modern-calendar"
                    tileClassName={({ date }) => {
                      const hasEvents = hasEventsOnDate(date);
                      return hasEvents ? 'has-events' : '';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {}
          <motion.div 
            className="w-full xl:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gray-800/80 backdrop-blur-md border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-blue-400 text-xl flex items-center">
                  <FaRegCalendarCheck className="mr-3" />
                  Events on {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading events...</p>
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id || index}
                        className={`relative bg-gray-700/50 p-4 rounded-lg border-l-4 hover:bg-gray-700/70 transition-colors duration-200 ${getPriorityColor(event.priority || 'low')}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {getCategoryIcon(event.category || 'other')}
                              <h4 className="text-white font-semibold text-lg ml-2">{event.title}</h4>
                              {event.priority === 'high' && (
                                <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                              {event.time && (
                                <div className="flex items-center">
                                  <FiClock className="mr-1" />
                                  {event.time}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center">
                                  <FiMapPin className="mr-1" />
                                  {event.location}
                                </div>
                              )}
                              {event.category && (
                                <div className="flex items-center">
                                  <span className="mr-1">🏷️</span>
                                  {event.category}
                                </div>
                              )}
                            </div>
                            
                            {event.link && (
                              <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm mt-3 transition-colors duration-200"
                              >
                                <FaExternalLinkAlt className="mr-1" />
                                View Details
                              </a>
                            )}
                          </div>
                          
                          {isAdmin && event.id && (
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => deleteEvent(event.id!)}
                                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                                title="Delete event"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FaCalendarAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory !== "all" 
                        ? "Try adjusting your search or filter criteria."
                        : "No events scheduled for this date."}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {}
      <style>{`
        .modern-calendar {
          background: transparent !important;
          border: none !important;
          color: white !important;
          width: 100%;
          font-family: inherit;
        }
        
        .modern-calendar .react-calendar__navigation {
          background: rgba(55, 65, 81, 0.5) !important;
          border-bottom: 1px solid rgba(75, 85, 99, 0.5) !important;
          margin-bottom: 0 !important;
        }
        
        .modern-calendar .react-calendar__navigation button {
          color: #00FFCC !important;
          background: none !important;
          border: none !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          padding: 0.75rem !important;
        }
        
        .modern-calendar .react-calendar__navigation button:hover {
          background: rgba(20, 184, 166, 0.1) !important;
        }
        
        .modern-calendar .react-calendar__month-view__weekdays {
          background: rgba(55, 65, 81, 0.3) !important;
          color: #9CA3AF !important;
          font-weight: 600 !important;
          text-align: center !important;
        }
        
        .modern-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.75rem 0.25rem !important;
          font-size: 0.875rem !important;
        }
        
        .modern-calendar .react-calendar__tile {
          background: none !important;
          border: none !important;
          color: white !important;
          padding: 0.75rem 0.25rem !important;
          font-size: 0.875rem !important;
          position: relative !important;
          transition: all 0.2s ease !important;
        }
        
        .modern-calendar .react-calendar__tile:hover {
          background: rgba(20, 184, 166, 0.1) !important;
          color: #00FFCC !important;
        }
        
        .modern-calendar .react-calendar__tile--active {
          background: #0D9488 !important;
          color: white !important;
        }
        
        .modern-calendar .react-calendar__tile--now {
          background: rgba(20, 184, 166, 0.2) !important;
          color: #00FFCC !important;
          font-weight: 600 !important;
        }
        
        .modern-calendar .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: #00FFCC;
          border-radius: 50%;
        }
        
        .modern-calendar .react-calendar__tile--neighboringMonth {
          color: #6B7280 !important;
        }
        
        .calendar-wrapper {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default CryptoCalendar;
