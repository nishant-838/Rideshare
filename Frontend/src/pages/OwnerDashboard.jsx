import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

export default function OwnerDashboard() {
  const [bikes, setBikes] = useState([]);
  const [newBike, setNewBike] = useState({
    bikeName: "",
    pricePerHour: "",
    image: "",
    mileage: "",
    description: "",
    tags: "",
  });

  const [editingBike, setEditingBike] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch all bikes belonging to the owner
  const fetchBikes = async () => {
    try {
      const res = await api.get("/bikes");
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

  // ✅ Add or Update Bike
  const handleSubmitBike = async () => {
    if (
      !newBike.bikeName ||
      !newBike.pricePerHour ||
      !newBike.image ||
      !newBike.mileage ||
      !newBike.description
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      ownerId: user?._id,
      bikeName: newBike.bikeName,
      image: newBike.image,
      pricePerHour: Number(newBike.pricePerHour),
      mileage: newBike.mileage,
      description: newBike.description,
      tags: newBike.tags.split(",").map((t) => t.trim()),
    };

    try {
      if (editingBike) {
        // ✏️ Update existing bike
        await api.put(`/bikes/${editingBike._id}`, payload);
        alert("✅ Bike updated successfully!");
      } else {
        // ➕ Add new bike
        await api.post("/bikes", payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("✅ Bike added successfully!");
      }

      setNewBike({
        bikeName: "",
        pricePerHour: "",
        image: "",
        mileage: "",
        description: "",
        tags: "",
      });
      setEditingBike(null);
      fetchBikes();
    } catch (err) {
      console.error("Error saving bike:", err);
      alert("❌ Failed to save bike. Check backend API.");
    }
  };

  // 🗑 Delete a bike
  const handleDeleteBike = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    try {
      await api.delete(`/bikes/${id}`);
      alert("🗑️ Bike deleted successfully!");
      fetchBikes();
    } catch (err) {
      console.error("Error deleting bike:", err);
      alert("❌ Failed to delete bike.");
    }
  };

  // ✏️ Edit bike handler
  const handleEditBike = (bike) => {
    setEditingBike(bike);
    setNewBike({
      bikeName: bike.bikeName,
      pricePerHour: bike.pricePerHour,
      image: bike.image,
      mileage: bike.mileage,
      description: bike.description,
      tags: bike.tags ? bike.tags.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Owner Dashboard
      </h1>

      {/* Add/Edit Bike Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl mb-4 font-semibold text-gray-700">
          {editingBike ? "Edit Bike" : "Add New Bike"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Bike Name"
            className="border p-2 w-full rounded"
            value={newBike.bikeName}
            onChange={(e) =>
              setNewBike({ ...newBike, bikeName: e.target.value })
            }
          />
          <input
            placeholder="Price per hour"
            className="border p-2 w-full rounded"
            value={newBike.pricePerHour}
            onChange={(e) =>
              setNewBike({ ...newBike, pricePerHour: e.target.value })
            }
          />
          <input
            placeholder="Mileage (km/l)"
            className="border p-2 w-full rounded"
            value={newBike.mileage}
            onChange={(e) =>
              setNewBike({ ...newBike, mileage: e.target.value })
            }
          />
          <input
            placeholder="Image URL"
            className="border p-2 w-full rounded"
            value={newBike.image}
            onChange={(e) =>
              setNewBike({ ...newBike, image: e.target.value })
            }
          />
        </div>

        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded mt-3"
          rows={3}
          value={newBike.description}
          onChange={(e) =>
            setNewBike({ ...newBike, description: e.target.value })
          }
        />

        <input
          placeholder="Tags (comma separated)"
          className="border p-2 w-full rounded mt-3"
          value={newBike.tags}
          onChange={(e) => setNewBike({ ...newBike, tags: e.target.value })}
        />

        <div className="flex justify-between mt-5">
          <button
            onClick={handleSubmitBike}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all"
          >
            {editingBike ? "Update Bike" : "Add Bike"}
          </button>
          {editingBike && (
            <button
              onClick={() => {
                setEditingBike(null);
                setNewBike({
                  bikeName: "",
                  pricePerHour: "",
                  image: "",
                  mileage: "",
                  description: "",
                  tags: "",
                });
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg transition-all"
            >
              Cancel
            </button>
          )}
        </div>
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
              className="bg-white shadow-md rounded-xl overflow-hidden transition-transform hover:scale-105"
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
                <p className="text-gray-600 text-sm mb-2">
                  Mileage: {bike.mileage} km/l
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {bike.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bike.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p
                  className={`text-sm font-semibold mt-2 ${
                    bike.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {bike.available ? "Available" : "Not Available"}
                </p>

                {/* Edit / Delete Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditBike(bike)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBike(bike._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
