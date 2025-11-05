import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center text-lg mt-10">Loading your bookings...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t booked any bikes yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition">
              <img
                src={b.bikeId?.image}
                alt={b.bikeId?.bikeName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {b.bikeId?.bikeName || "Bike Deleted"}
                </h3>
                <p className="text-gray-600">Total: ₹{b.totalAmount}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(b.startTime).toLocaleString()} →{" "}
                  {new Date(b.endTime).toLocaleString()}
                </p>
                <p
                  className={`mt-2 font-semibold ${
                    b.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {b.paymentStatus === "paid" ? "Payment Done" : "Pending Payment"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
