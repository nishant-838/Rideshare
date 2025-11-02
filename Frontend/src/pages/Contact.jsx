import React from "react";
import bikeIllustration from "../assets/bike-illustration.png"; // ✅ Place your bike image in /src/assets

export default function ContactUs() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=1600&q=80')", // background image of bikes
      }}
    >
      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-10 py-6 bg-transparent">
          <div className="text-white font-extrabold text-2xl tracking-wide">RideOn</div>
          <div className="space-x-8 flex items-center text-lg">
            <a href="/" className="text-gray-200 hover:text-white hover:underline">Home</a>
            <a href="/services" className="text-gray-200 hover:text-white hover:underline">Services</a>
            <a href="/pricing" className="text-gray-200 hover:text-white hover:underline">Pricing</a>
            <a href="/contact" className="text-white font-semibold underline">Contact</a>
          </div>
        </nav>

        {/* Contact Section */}
        <div className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="bg-white/95 rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden backdrop-blur-md">
            
            {/* Left Side – Form */}
            <form className="flex-1 flex flex-col space-y-6 p-8">
              <h2 className="text-3xl font-bold text-indigo-700">Get in Touch</h2>
              <p className="text-gray-600">We’re here to help! Send your queries or feedback.</p>

              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows={4}
                placeholder="Your Message..."
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-200"
              >
                Submit
              </button>
            </form>

            {/* Right Side – Info & Illustration */}
            <div className="flex-1 bg-gradient-to-b from-blue-500 to-indigo-700 text-white flex flex-col justify-center items-center space-y-6 p-8">
              <img
                src={bikeIllustration || "https://cdn-icons-png.flaticon.com/512/3202/3202926.png"}
                alt="Bike illustration"
                className="w-44 h-44 object-contain"
              />

              <ul className="space-y-4 text-sm md:text-base">
                <li className="flex items-center gap-3">
                  <span className="text-yellow-300 text-xl">📍</span>
                  221B Ride Street, Speed City
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-300 text-xl">📞</span>
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-300 text-xl">✉️</span>
                  contact@rideon.com
                </li>
              </ul>

              <div className="flex gap-3 mt-2">
                <a href="#" className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
