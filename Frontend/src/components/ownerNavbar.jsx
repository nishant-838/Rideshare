import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Star, LogOut } from "lucide-react";
import backLogo from "../images/logo.png";

export default function OwnerNavbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* ---------- LEFT: Logo + App Name ---------- */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/owner/dashboard")}
      >
        <img
          src={backLogo}
          alt="RideShare Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          RideShare
        </h1>
      </div>

      {/* ---------- RIGHT: Owner Options ---------- */}
      {user ? (
        <div className="flex items-center gap-6">
          {/* <button
            onClick={() => navigate("/owner-dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <Edit size={18} /> <span>Edit</span>
          </button>

          <button
            onClick={() => navigate("/owner-dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
          >
            <Trash2 size={18} /> <span>Delete</span>
          </button> */}

          <button
            onClick={() => navigate("/owner/reviews")}
            className="flex items-center gap-2 text-gray-700 hover:text-yellow-500 transition"
          >
            <Star size={18} /> <span>Reviews</span>
          </button>

          <div className="flex items-center gap-3 border-l pl-4">
            <img
              src={
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <span className="font-medium text-gray-800">
              {user.username || "Owner"}
            </span>

            <button
              onClick={handleLogout}
              className="ml-3 p-2 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut
                className="text-gray-600 hover:text-red-500"
                size={20}
              />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Login
        </button>
      )}
    </nav>
  );
}
