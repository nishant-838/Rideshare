import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import OwnerNavbar from "../components/ownerNavbar";
import OwnerFooter from "../components/ownerFooter";
import CustomerMap from "./CustomerMap"; 

export default function OwnerDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [bikes, setBikes] = useState([]);
  const [showLiveTracking, setShowLiveTracking] = useState(false); 
  const [imageFile, setImageFile] = useState(null); // 🚀 Tracks our raw binary uploaded file
  const [submitting, setSubmitting] = useState(false); // Handles loading spinner status states

  const [newBike, setNewBike] = useState({
    bikeName: "",
    pricePerHour: "",
    mileage: "",
    description: "",
    tags: "",
    vehicleType: "",
  });
  const [editingBike, setEditingBike] = useState(null);

  const formRef = useRef(null); 

  const scrollToEdit = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fetchBikes = async () => {
    try {
      const res = await api.get("/bikes");
      const ownerBikes = res.data.filter(
        (bike) => bike.ownerId?._id === user?._id
      );

      const bikesWithRatings = await Promise.all(
        ownerBikes.map(async (bike) => {
          if (bike._id) {
            try {
              const ratingRes = await api.get(`/bikes/${bike._id}/ratings`);
              return { ...bike, avgRating: ratingRes.data.avgRating };
            } catch (err) {
              console.error("Failed to fetch rating for bike:", bike._id);
              return { ...bike, avgRating: 0 };
            }
          }
          return bike;
        })
      );

      setBikes(bikesWithRatings);
    } catch (err) {
      console.error("Error fetching bikes:", err);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // 🚀 Intercept selected files directly
  };

  const handleSubmitBike = async () => {
    if (
      !newBike.bikeName ||
      !newBike.pricePerHour ||
      !newBike.mileage ||
      !newBike.description ||
      !newBike.vehicleType
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!editingBike && !imageFile) {
      alert("Please select a vehicle image file to upload!");
      return;
    }

    try {
      setSubmitting(true);

      // 🚀 Pack parameters using FormData to support multi-part binary streaming
      const data = new FormData();
      data.append("ownerId", user?._id);
      data.append("bikeName", newBike.bikeName);
      data.append("pricePerHour", Number(newBike.pricePerHour));
      data.append("mileage", newBike.mileage);
      data.append("description", newBike.description);
      data.append("vehicleType", newBike.vehicleType);
      data.append("tags", newBike.tags);
      
      if (imageFile) {
        data.append("image", imageFile); // Must align with single("image") naming parameters on backend router
      }

      const token = localStorage.getItem("token");

      if (editingBike) {
        await api.put(`/bikes/${editingBike._id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          }
        });
        alert("Vehicle updated successfully!");
      } else {
        await api.post("/bikes", data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          }
        });
        alert("Vehicle added successfully!");
      }

      setNewBike({
        bikeName: "",
        pricePerHour: "",
        mileage: "",
        description: "",
        tags: "",
        vehicleType: "",
      });
      setImageFile(null);
      setEditingBike(null);
      fetchBikes();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      alert("Failed to save vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBike = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/bikes/${id}`);
      alert("🗑️ Vehicle deleted successfully!");
      fetchBikes();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Failed to delete vehicle.");
    }
  };

  const handleEditBike = (bike) => {
    setEditingBike(bike);
    setNewBike({
      bikeName: bike.bikeName,
      pricePerHour: bike.pricePerHour,
      mileage: bike.mileage,
      description: bike.description,
      tags: bike.tags ? bike.tags.join(", ") : "",
      vehicleType: bike.vehicleType || "",
    });
    scrollToEdit();
  };

  const renderStars = (avgRating) => {
    const stars = [];
    const rounded = Math.round(avgRating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rounded ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 min-h-screen flex flex-col">
      <OwnerNavbar user={user} scrollToEdit={scrollToEdit} />

      <div className="flex-grow p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 p-1.5 rounded-xl shadow-md inline-flex gap-2 border border-gray-200">
            <button
              onClick={() => setShowLiveTracking(false)}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                !showLiveTracking
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              🛠️ Manage Fleet
            </button>
            <button
              onClick={() => setShowLiveTracking(true)}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                showLiveTracking
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              🛰️ Live Track Bikes
            </button>
          </div>
        </div>

        {showLiveTracking ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-100">
            <CustomerMap />
          </div>
        ) : (
          <>
            <div
              ref={formRef}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full border border-gray-100 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-3xl mb-6 font-extrabold text-center">
                {editingBike ? "✏️ Edit Vehicle Details" : "🚘 Add New Vehicle"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  placeholder="Vehicle Name"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  value={newBike.bikeName}
                  onChange={(e) =>
                    setNewBike({ ...newBike, bikeName: e.target.value })
                  }
                />
                <input
                  placeholder="Price per hour"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  value={newBike.pricePerHour}
                  onChange={(e) =>
                    setNewBike({ ...newBike, pricePerHour: e.target.value })
                  }
                />
                <select
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  value={newBike.vehicleType}
                  onChange={(e) =>
                    setNewBike({ ...newBike, vehicleType: e.target.value })
                  }
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooty">Scooty</option>
                  <option value="Electric">Electric</option>
                  <option value="Sports">Sports</option>
                </select>

                <input
                  placeholder="Mileage (km/l)"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  value={newBike.mileage}
                  onChange={(e) =>
                    setNewBike({ ...newBike, mileage: e.target.value })
                  }
                />

                {/* 🚀 CHANGED: Swapped text URL box out for a real browser File Upload Input picker field */}
                <input
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm md:col-span-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={handleFileChange}
                />
              </div>

              <textarea
                placeholder="Description"
                className="border border-gray-300 p-3 w-full rounded-lg mt-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                rows={3}
                value={newBike.description}
                onChange={(e) =>
                  setNewBike({ ...newBike, description: e.target.value })
                }
              />

              <input
                placeholder="Tags (comma separated)"
                className="border border-gray-300 p-3 w-full rounded-lg mt-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                value={newBike.tags}
                onChange={(e) => setNewBike({ ...newBike, tags: e.target.value })}
              />

              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={handleSubmitBike}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 px-10 rounded-xl hover:shadow-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {submitting ? "Uploading Vehicle..." : editingBike ? "Update Vehicle" : "Add Vehicle"}
                </button>
                {editingBike && (
                  <button
                    onClick={() => {
                      setEditingBike(null);
                      setNewBike({
                        bikeName: "",
                        pricePerHour: "",
                        mileage: "",
                        description: "",
                        tags: "",
                        vehicleType: "",
                      });
                      setImageFile(null);
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-10 rounded-xl transition-all transform hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Vehicles List */}
            <h2 className="text-3xl font-bold text-center mt-12 mb-6 text-indigo-700">
              Your Listed Vehicles
            </h2>

            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {bikes.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No vehicles listed yet.
                </p>
              ) : (
                bikes.map((bike) => (
                  <div
                    key={bike._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform border border-gray-100"
                  >
                    <img
                      src={bike.image}
                      alt={bike.bikeName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {bike.bikeName}
                      </h3>
                      <p className="text-gray-500">₹{bike.pricePerHour}/hour</p>
                      <p className="text-sm text-gray-600">
                        Mileage: {bike.mileage} km/l
                      </p>
                      <p className="text-sm text-indigo-600 font-semibold">
                        {bike.vehicleType}
                      </p>

                      <div className="flex items-center mt-2">
                        {renderStars(bike.avgRating || 0)}
                        <span className="text-gray-600 ml-2 text-sm">
                          ({bike.avgRating?.toFixed(1) || "0"} / 5)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {bike.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

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
          </>
        )}
      </div>

      <OwnerFooter />
    </div>
  );
}