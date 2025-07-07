

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth, db } from "../utils/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import AddCryptoEventForm from "./AddCryptoEventForm";

interface EventItem {
  title: string;
  description: string;
  link?: string;
  date: string;
}

const CryptoCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u?.email === "hariharanath247@gmail.com") {
        setIsAdmin(true);
      }
    });
    return () => unsub();
  }, []);

  // Fetch events from Firestore based on selected date
  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const q = query(collection(db, "events"), where("date", "==", dateStr));
    const unsub = onSnapshot(q, (snap) => {
      const fetched: EventItem[] = [];
      snap.forEach((doc) => fetched.push(doc.data() as EventItem));
      setEvents(fetched);
    });
    return () => unsub();
  }, [selectedDate]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          <FaCalendarAlt className="inline-block mr-2" /> Cryptocurrency Calendar
        </h1>
        <p className="text-gray-400 mt-2">Select a date to view events.</p>
      </motion.div>

      {/* Calendar + Event Display */}
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="w-full lg:w-1/3 bg-gray-950 border-none">
          <CardHeader>
            <CardTitle className="text-teal-400 text-lg">📅 Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg bg-gray-800 text-white border-none"
            />
          </CardContent>
        </Card>

        <Card className="w-full lg:w-2/3 bg-gray-950 border-none">
          <CardHeader>
            <CardTitle className="text-blue-400 text-lg">
              <FaRegCalendarCheck className="inline-block mr-2" /> Events on {selectedDate.toDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <ul className="space-y-4">
                {events.map((e, i) => (
                  <li key={i} className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <h4 className="text-teal-300 font-semibold text-lg">{e.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{e.description}</p>
                    {e.link && (
                      <a
                        href={e.link}
                        target="_blank"
                        className="text-blue-400 hover:underline text-sm block mt-1"
                      >
                        🔗 {e.link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No events available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Upload */}
      {isAdmin && (
        <div className="mt-10">
          <AddCryptoEventForm onEventAdded={() => {}} />
        </div>
      )}
    </div>
  );
};

export default CryptoCalendar;
