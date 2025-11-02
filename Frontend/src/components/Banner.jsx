import React from "react";
import { motion } from "framer-motion";
import { Bike, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Banner({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!isLoggedIn) {
      alert("Please login or register to book a ride 🚲");
      navigate("/login");
    } else {
      navigate("/bikes");
    }
  };

  return (
    <section
      id="availability"
      className="relative bg-linear-to-r from-blue-950 via-blue-900 to-indigo-800 text-white py-14 px-6 text-center shadow-lg"
    >
      <div className="absolute inset-0 bg-[url('/assets/bike-banner.jpg')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Available Near You 🚴‍♀️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-200 text-lg"
        >
          24 bikes and scooters are ready for your next ride!
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleBookClick}
          className={`flex items-center gap-2 py-3 px-8 rounded-full font-semibold transition-all shadow-md ${
            isLoggedIn
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-gray-200"
          }`}
        >
          {isLoggedIn ? (
            <>
              <Bike className="w-5 h-5" /> Book a Ride
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" /> Login to Book
            </>
          )}
        </motion.button>
      </div>
    </section>
  );
}
