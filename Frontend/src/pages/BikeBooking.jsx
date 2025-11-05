import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BikeBooking() {
  const [bikes, setBikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/bikes").then(res => setBikes(res.data));
  }, []);

  const handleBook = (bikeId, price) => {
    if (!localStorage.getItem("token")) {
      alert("Please login to book a bike");
      navigate("/login");
      return;
    }
    navigate("/payment", { state: { amount: price, bikeId } });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">Available Bikes Near You</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bikes.map(bike => (
          <div
            key={bike._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img src={bike.image} alt={bike.name} className="w-full h-56 object-cover" />
            <div className="p-5 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{bike.name}</h2>
              <p className="text-gray-500 mb-4">₹{bike.price}/hour</p>
              <button
                onClick={() => handleBook(bike._id, bike.price)}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
