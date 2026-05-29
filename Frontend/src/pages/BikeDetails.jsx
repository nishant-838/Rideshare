import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Star, Clock, CalendarDays, ArrowLeft } from "lucide-react";
import cycleBg from "../images/NIT.jpeg";
import logoBG from "../images/AI.png";
import api from "../api/axios";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  //  Fetch bike details
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const filters = JSON.parse(localStorage.getItem("searchFilters"));
        if (!filters?.pickupDate || !filters?.pickupTime || !filters?.dropTime) {
          setError("Please select pickup and drop times before viewing this bike.");
          setLoading(false);
          return;
        }

        const res = await api.get(`/bikes/${id}`);
        setBike(res.data);

        // Calculate duration
        const start = new Date(`${filters.pickupDate}T${filters.pickupTime}`);
        const end = new Date(`${filters.pickupDate}T${filters.dropTime}`);
        const hours = Math.max((end - start) / (1000 * 60 * 60), 1);
        setDuration(hours.toFixed(1));
        setTotal(res.data.pricePerHour * hours);
      } catch (err) {
        console.error(err);
        setError("Failed to load bike details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  //  Handle booking and trigger backend SMS
  const handleBook = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return navigate("/login");

      const filters = JSON.parse(localStorage.getItem("searchFilters"));
      if (!filters) return alert("Please select pickup and drop times!");

      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("You must be logged in to book a bike!");
        return navigate("/login");
      }

      // 🌟 FIX: Parse local inputs into synchronized JavaScript Date boundaries
      const localStart = new Date(`${filters.pickupDate}T${filters.pickupTime}`);
      const localEnd = new Date(`${filters.pickupDate}T${filters.dropTime}`);

      const bookingData = {
        renterId: storedUser._id,
        bikeId: id,
        date: filters.pickupDate,
        // 🌟 FIX: Send explicit, absolute ISO strings to protect database values from offsets
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        totalAmount: total,
        mobile: storedUser.mobile, 
      };

      const res = await api.post("/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      alert(res.data.message || " Bike booked successfully!");
      navigate("/mybookings");
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("Failed to book the bike. Please try again.");
    }
  };

  //  Loading State
  if (loading)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
          Loading bike details...
        </div>
      </>
    );

  // Error State
  if (error)
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-gray-700 text-lg">{error}</div>
      </>
    );

  if (!bike)
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-gray-600">Bike not found.</div>
      </>
    );

  const filters = JSON.parse(localStorage.getItem("searchFilters"));

  return (
    <>
      <Navbar />

      {/* Header Banner */}
      <div
        className="relative h-40 sm:h-52 flex items-center justify-between px-8 sm:px-16 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${cycleBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTop: "4px solid #03A9F4",
        }}
      >
        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{bike.bikeName}</h1>
          <p className="text-sm sm:text-base text-gray-200 mt-1">
            Home <span className="text-gray-400 mx-1">›</span> Products
          </p>
        </div>

        <div className="hidden sm:block opacity-80">
          <img
            src={logoBG}
            alt="RideShare Logo"
            className="h-14 border-[50%] rounded-b-full"
          />
        </div>
      </div>

      {/* Main Bike Details */}
      <div className="bg-gray-50 min-h-screen py-10">
        <motion.div
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image */}
          <div className="relative bg-gray-100 flex justify-center items-center p-6">
            {bike.rating && (
              <div className="absolute top-4 left-4 bg-white shadow-md px-3 py-1 rounded-md flex items-center gap-1">
                <Star className="text-yellow-500 w-4 h-4 fill-yellow-400" />
                <span className="text-green-600 font-semibold">
                  {bike.rating.toFixed(1)} / 5
                </span>
                {bike.reviews && (
                  <span className="text-gray-500 text-sm ml-1">
                    ({bike.reviews} reviews)
                  </span>
                )}
              </div>
            )}
            <img
              src={bike.image}
              alt={bike.bikeName}
              className="w-[85%] sm:w-[70%] lg:w-[60%] object-contain drop-shadow-md"
            />
          </div>

          {/* Info Section */}
          <div className="p-8 md:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {bike.bikeName}
            </h1>
            <p className="text-gray-600 mb-4 text-lg">
              ₹{bike.pricePerHour} / hour
            </p>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                Description
              </h3>
              <p className="text-gray-600 italic">
                {bike.description || "Owner has not added a description yet."}
              </p>
            </div>

            {/* Date & Duration */}
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>
                    <strong>Date:</strong> {filters.pickupDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    <strong>From:</strong> {filters.pickupTime} →{" "}
                    <strong>To:</strong> {filters.dropTime}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-800">
                Duration: <strong>{duration} hours</strong>
              </p>
            </div>

            {/* Total Amount */}
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Total Amount:{" "}
              <span className="text-green-600">₹{total.toFixed(0)}</span>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Change Pickup/Drop Time
              </button>
              <button
                onClick={handleBook}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Rent This Bike
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}