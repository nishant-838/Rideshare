import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cycleBg from "../images/cycle4.jpeg";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    role: "renter",
    idCard: null,
    license: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      // ✅ Use Axios instead of fetch
      const res = await api.post("/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`✅ ${res.data.message}`);

      // Redirect based on role
      if (formData.role === "owner") navigate("/login");
      else navigate("/login");

    } catch (err) {
      console.error("❌ Registration Error:", err);
      alert(`⚠️ ${err.response?.data?.message || "Server error. Please try again later."}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${cycleBg})` }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-2xl mx-4">
        <h2 className="text-4xl font-extrabold text-center text-white mb-10">
          🚴 Join the RideShare Community
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white"
        >
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* ID Proof */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-1">Upload ID Proof</label>
            <input
              type="file"
              name="idCard"
              onChange={handleChange}
              accept="image/*,application/pdf"
              required
              className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-white/80 file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-700"
            />
          </div>

          {/* License Upload */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-1">Upload Driving License</label>
            <input
              type="file"
              name="license"
              onChange={handleChange}
              accept="image/*,application/pdf"
              required
              className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-white/80 file:bg-green-600 file:text-white file:rounded-md file:px-4 file:py-2 hover:file:bg-green-700"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              Register Now
            </button>
          </div>
        </form>

        <p className="text-center text-gray-200 mt-6 text-sm">
          Already a member?{" "}
          <a href="/login" className="text-blue-300 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
