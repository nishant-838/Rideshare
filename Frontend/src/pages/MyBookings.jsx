import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingValue, setRatingValue] = useState({}); // temporary state while submitting
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must log in to view your bookings.");
          setLoading(false);
          return;
        }

        const res = await api.get("/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Booking fetch error:", err);
        setError("Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Cancel booking
  const handleCancel = async (id, startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffInHours = (start - now) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      alert(" You cannot cancel within 1 hour of pickup time.");
      return;
    }

    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert(" Booking cancelled successfully.");
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } catch (err) {
        console.error("Cancel booking error:", err);
        alert("Failed to cancel booking. Try again later.");
      }
    }
  };

  // Rate bike
  const handleRate = async (bikeId, value, bookingId) => {
    try {
      setSubmittingRating(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/bikes/${bikeId}/rate`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // temporarily update UI
      setRatingValue((prev) => ({ ...prev, [bookingId]: value }));
      alert(`Rated successfully! Avg rating: ${res.data.avgRating.toFixed(1)}`);
    } catch (err) {
      console.error("Rate bike error:", err);
      alert(err.response?.data?.message || "Failed to rate bike.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const currentTime = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.endTime) > currentTime);
  const pastBookings = bookings.filter((b) => new Date(b.endTime) <= currentTime);

  // Render individual booking card
  const renderBookingCard = (b) => {
    const isPastBooking = new Date(b.endTime) <= currentTime;
    const rated = b.userRating || ratingValue[b._id]; // backend rating or temp state

    return (
      <div
        key={b._id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
      >
        <img
          src={b.bikeId?.image || "https://via.placeholder.com/600x360?text=Bike"}
          alt={b.bikeId?.bikeName}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {b.bikeId?.bikeName || "Bike Deleted"}
          </h3>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Total:</span> ₹{b.totalAmount}
          </p>
          <div className="text-sm text-gray-500 mb-3">
            <p>
              <span className="font-medium text-gray-700">From:</span>{" "}
              {new Date(b.startTime).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-gray-700">To:</span>{" "}
              {new Date(b.endTime).toLocaleString()}
            </p>
          </div>

          {/* Cancel button for upcoming rides */}
          {!isPastBooking && (
            <button
              onClick={() => handleCancel(b._id, b.startTime)}
              className="w-full mt-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition duration-200"
            >
              Cancel Booking
            </button>
          )}

          {/* Rating for past rides */}
          {isPastBooking && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Rate this bike:</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(b.bikeId._id, star, b._id)}
                    className={`text-2xl ${rated >= star ? "text-yellow-500" : "text-gray-300"}`}
                    disabled={!!b.userRating || submittingRating} // disable if already rated
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Average rating: {b.bikeId?.avgRating?.toFixed(1) || "—"} ⭐
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-blue-600 animate-pulse">Loading your bookings...</p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700 drop-shadow-sm">
          My Bookings
        </h1>

        {/* Upcoming Rides */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-green-700">
            Current & Upcoming Rides
          </h2>
          {upcomingBookings.length === 0 ? (
            <div className="text-gray-500 text-lg">No active bookings 🚴‍♂️</div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map(renderBookingCard)}
            </div>
          )}
        </section>

        {/* Ride History */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Ride History</h2>
          {pastBookings.length === 0 ? (
            <div className="text-gray-500 text-lg">No past rides yet.</div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map(renderBookingCard)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
