import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; //  import the Axios instance

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "renter", // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //  Using Axios POST method from api/axios.js
      const { data } = await API.post("/login", formData);

      setLoading(false);
      alert(" Login successful!");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (formData.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 w-96 max-w-full backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to continue your ride with{" "}
          <span className="text-blue-600 font-semibold">RideShare</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
