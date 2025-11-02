import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import headerbike from "../assets/headerbike.png";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ for page navigation
import axios from "axios"; // ✅ for API request

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
      // ✅ Call your backend controller: getAvailableBikes
      const response = await axios.get("http://localhost:5000/api/bikes/available", {
        params: {
          date: pickupDate,
          startTime: pickupTime,
          endTime: dropTime,
        },
      });

      // ✅ Save search filters + results temporarily
      localStorage.setItem("searchFilters", JSON.stringify({ pickupDate, pickupTime, dropTime }));
      localStorage.setItem("availableBikes", JSON.stringify(response.data));

      // ✅ Navigate to renter dashboard
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

      <div className="absolute inset-0 bg-linear-to-b from-black/50 to-blue-900/70"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-300 to-green-400 drop-shadow-lg"
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
            className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-4 text-black"
          >
            {/* Pick-up Date */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Pick-up Date</label>
              <div className="flex items-center bg-white rounded-md px-3 py-2">
                <Calendar size={18} className="text-gray-600 mr-2" />
                <input
                  type="date"
                  className="outline-none bg-transparent text-sm"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Pick-up Time */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Pick-up Time</label>
              <div className="flex items-center bg-white rounded-md px-3 py-2">
                <Clock size={18} className="text-gray-600 mr-2" />
                <input
                  type="time"
                  className="outline-none bg-transparent text-sm"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>
            </div>

            {/* Drop Time */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Drop Time</label>
              <div className="flex items-center bg-white rounded-md px-3 py-2">
                <Clock size={18} className="text-gray-600 mr-2" />
                <input
                  type="time"
                  className="outline-none bg-transparent text-sm"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                  min={pickupTime}
                />
              </div>
            </div>

            {/* ✅ Find button triggers backend call + navigation */}
            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Find Bike / Scooty
            </button>

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
