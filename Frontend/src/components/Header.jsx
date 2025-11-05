import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import headerbike from "../assets/headerbike.png";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Header() {
  const [user, setUser] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleSearch = async () => {
    setError("");

    if (!pickupDate || !pickupTime || !dropTime) {
      setError("Please select all fields.");
      return;
    }

    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const drop = new Date(`${pickupDate}T${dropTime}`);

    if (drop <= pickup) {
      setError("Drop time must be later than pickup time.");
      return;
    }

    try {
      const response = await api.get("/bikes/available", {
        params: {
          date: pickupDate,
          startTime: pickupTime,
          endTime: dropTime,
        },
      });

      localStorage.setItem("searchFilters", JSON.stringify({ pickupDate, pickupTime, dropTime }));
      localStorage.setItem("availableBikes", JSON.stringify(response.data));

      navigate("/renter-dashboard");
    } catch (err) {
      console.error("Error fetching available bikes:", err);
      setError("Failed to fetch available bikes. Try again later.");
    }
  };

  return (
    <header className="relative text-white overflow-hidden h-[80vh] flex items-center justify-center">
      <img
        src={headerbike}
        alt="Bike ride"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/70"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-green-400 drop-shadow-lg"
        >
          Rent Bikes. Ride Anywhere.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-100 mb-10"
        >
          Explore your city with comfort and freedom — easy hourly bike and scooty rentals.
        </motion.p>

        {!user ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all"
            >
              Check Availability
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 flex flex-wrap items-center justify-center gap-6 text-black shadow-lg"
          >
            {/* Pick-up Date */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-semibold">Pick-up Date</label>
              <div className="flex items-center bg-white/80 hover:bg-white px-4 py-2 rounded-lg shadow-sm transition-all">
                <Calendar size={18} className="text-gray-600 mr-2" />
                <input
                  type="date"
                  className="outline-none bg-transparent text-gray-800 text-sm"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Pick-up Time */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-semibold">Pick-up Time</label>
              <div className="flex items-center bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                <Clock size={18} className="text-blue-600 mr-2" />
                <input
                  type="time"
                  className="outline-none bg-transparent text-gray-800 text-sm"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>
            </div>

            {/* Drop Time */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-semibold">Drop Time</label>
              <div className="flex items-center bg-gradient-to-r from-green-100 to-lime-100 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                <Clock size={18} className="text-green-600 mr-2" />
                <input
                  type="time"
                  className="outline-none bg-transparent text-gray-800 text-sm"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                  min={pickupTime}
                />
              </div>
            </div>

            {/* Find Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              🔍 Find Bike / Scooty
            </motion.button>

            {error && (
              <p className="text-red-400 text-sm mt-2 w-full text-center font-medium">
                {error}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
