import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerDashboard() {
  const [bikes, setBikes] = useState([]);
  const [newBike, setNewBike] = useState({
    bikeName: "",
    pricePerHour: "",
    image: "",
  });

  // Assume you have saved the logged-in user info in localStorage after login
  const user = JSON.parse(localStorage.getItem("user")); // should contain _id, role, etc.

  // Fetch all bikes belonging to this owner
  const fetchBikes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bikes");
      // Optionally, show only bikes owned by this owner
      const ownerBikes = res.data.filter(
        (bike) => bike.ownerId?._id === user?._id
      );
      setBikes(ownerBikes);
    } catch (err) {
      console.error("Error fetching bikes:", err);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // Add a new bike
  const handleAddBike = async () => {
    if (!newBike.bikeName || !newBike.pricePerHour || !newBike.image) {
      alert("Please fill all fields before adding a bike.");
      return;
    }

    try {
      const payload = {
        ownerId: user?._id, // logged-in owner's id
        bikeName: newBike.bikeName,
        image: newBike.image,
        pricePerHour: Number(newBike.pricePerHour),
      };
      const res = await axios.post("http://localhost:5000/api/bikes", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201 || res.status === 200) {
        alert("✅ Bike added successfully!");
        setNewBike({ bikeName: "", pricePerHour: "", image: "" });
        fetchBikes();
      }
    } catch (err) {
      console.error("Error adding bike:", err);
      alert("❌ Failed to add bike. Check backend API.");
    }
  };

  return (
    <div className="p-8 bg-linear-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Owner Dashboard
      </h1>

      {/* Add Bike Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
        <h2 className="text-2xl mb-4 font-semibold text-gray-700">Add New Bike</h2>
        <input
          placeholder="Bike Name"
          className="border p-2 w-full mb-2 rounded"
          value={newBike.bikeName}
          onChange={(e) =>
            setNewBike({ ...newBike, bikeName: e.target.value })
          }
        />
        <input
          placeholder="Price per hour"
          className="border p-2 w-full mb-2 rounded"
          value={newBike.pricePerHour}
          onChange={(e) =>
            setNewBike({ ...newBike, pricePerHour: e.target.value })
          }
        />
        <input
          placeholder="Image URL"
          className="border p-2 w-full mb-4 rounded"
          value={newBike.image}
          onChange={(e) => setNewBike({ ...newBike, image: e.target.value })}
        />
        <button
          onClick={handleAddBike}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Add Bike
        </button>
      </div>

      {/* Listed Bikes */}
      <h2 className="text-3xl font-semibold text-center mt-10 mb-6 text-gray-700">
        Your Listed Bikes
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {bikes.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No bikes listed yet.
          </p>
        ) : (
          bikes.map((bike) => (
            <div
              key={bike._id}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <img
                src={bike.image}
                alt={bike.bikeName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {bike.bikeName}
                </h3>
                <p className="text-gray-500">₹{bike.pricePerHour}/hour</p>
                <p
                  className={`text-sm font-semibold ${
                    bike.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {bike.available ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
