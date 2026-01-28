import React, { useEffect, useState } from "react";
import api from "../api/axios";
import bg from "../images/marathon.png";
import Navbar from "../components/profileNavbar";
import Footer from "../components/Footer";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-700">
        Loading your profile...
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Please log in to view your profile.
      </div>
    );

   

  return (
    <>
     <Navbar username={user.username} /> 
     <div
          className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-6"
          style={{
              backgroundImage: `url(${bg})`, //  Add your image link here
              backgroundSize: "cover",
              backgroundPosition: "center",
          }}
      >
          {/* Overlay for better readability */}
          {/* <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div> */}

          <div className="relative z-10 w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl text-white p-8 transition-transform hover:scale-[1.02]">
              <h2 className="text-4xl font-bold mb-6 text-center text-yellow-300 tracking-wide">
                  Profile Overview
              </h2>

              <div className="space-y-5 text-lg">
                  <p><span className="font-semibold text-yellow-200">Name:</span> {user.name}</p>
                  <p><span className="font-semibold text-yellow-200">Email:</span> {user.email}</p>
                  <p><span className="font-semibold text-yellow-200">Mobile:</span> {user.mobile}</p>
                  <p><span className="font-semibold text-yellow-200">Username:</span> {user.username}</p>
                  <p><span className="font-semibold text-yellow-200">Role:</span> {user.role}</p>

                  {user.idCard && (
                      <div>
                          <p><span className="font-semibold text-yellow-200">ID Card:</span> </p>
                          <span className="inline-block mt-1 text-green-300 bg-green-900/40 px-3 py-1 rounded-full text-sm font-semibold">
                              Verified
                          </span>
                      </div>
                  )}

                  {user.license && (
                      <div>
                          <p><span className="font-semibold text-yellow-200">License:</span></p>
                          <span className="inline-block mt-1 text-green-300 bg-green-900/40 px-3 py-1 rounded-full text-sm font-semibold">
                              Verified
                          </span>
                      </div>
                  )}
              </div>

              <button
                  className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                  onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                  } }
              >
                  Logout
              </button>
          </div>
      </div><Footer /></>
  );
}
