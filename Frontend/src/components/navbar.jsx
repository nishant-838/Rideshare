import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoBG from "../images/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* ---------- LEFT: LOGO + NAV LINKS ---------- */}
        <div className="flex items-center gap-6">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={logoBG}
              alt="RideShare Logo"
              className="w-14 h-14 rounded-full"
            />
            <h1 className="text-2xl font-bold text-blue-600">RideShare</h1>
          </div>

          {/* NAV LINKS */}
          <ul className="hidden md:flex items-center gap-6 ml-6 text-gray-700 font-medium">
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-blue-600">
                Offers
              </Link>
            </li>
            <li>
              <Link to="/extend" className="hover:text-blue-600">
                Extend
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-blue-600">
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        {/* ---------- RIGHT: AUTH / USER ---------- */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              {/* LOGIN + REGISTER (before login) */}
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden md:block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* USER AVATAR + NAME (after login) */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full hover:bg-blue-100 transition"
                >
                  <User className="text-blue-600" size={20} />
                  <span className="text-gray-800 font-medium">
                    {user.name || "User"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md overflow-hidden border">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/mybookings")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MOBILE MENU ICON */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-6 py-4 space-y-3">
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600">
            Contact Us
          </Link>
          <Link to="/offers" className="block text-gray-700 hover:text-blue-600">
            Offers
          </Link>
          <Link to="/extend" className="block text-gray-700 hover:text-blue-600">
            Extend
          </Link>
          <Link to="/reviews" className="block text-gray-700 hover:text-blue-600">
            Reviews
          </Link>
          <hr />
          {!user ? (
            <>
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/mybookings")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Bookings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
