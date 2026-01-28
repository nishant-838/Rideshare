import React from "react";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar({ username }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-20 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left side - Logo + Name */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 rounded-full border border-white/40 shadow-sm"
          />
          <h1 className="text-grey-700 text-2xl font-bold tracking-wide drop-shadow-md">
            RideShare
          </h1>
        </div>

        {/* Right side - Username */}
        <div className="text-white font-medium text-lg bg-grey/20 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md shadow-sm">
          {username ? username : "Welcome"}
        </div>
      </div>
    </nav>
  );
}
