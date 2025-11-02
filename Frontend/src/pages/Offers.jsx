import React from "react";
import bikeBg from "../images/cycle.jpg"; // ✅ Add your own image in src/assets folder

export default function Offers() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          `url(${bikeBg || "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1600&q=80"})`,
      }}
    >
      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto py-16 px-6 text-white">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
          <span className="bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded-md text-xs mb-2 inline-block">
            🚀 Hot Deals
          </span>

          <h1 className="text-4xl font-extrabold mb-3">
            Unleash the <span className="text-yellow-400">Best Offers</span> on Bike Rentals
          </h1>

          <p className="text-gray-200 mb-8 text-lg leading-relaxed">
            Whether you're commuting to college or planning a weekend escape, save big on every ride.
            Get up to <span className="text-yellow-300 font-semibold">85% off</span> on selected bikes & scooters!
          </p>

          <div className="space-x-4 mb-10">
            <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition">
              Start Renting
            </button>
            <button className="bg-transparent border border-yellow-400 text-yellow-300 font-semibold px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              View All Deals
            </button>
          </div>

          {/* Offer Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
            {[
              { title: "Up to 85% OFF", desc: "Exclusive discounts on top bikes" },
              { title: "Cashback Rewards", desc: "Earn ₹50 on every completed ride" },
              { title: "Instant Deals", desc: "Lightning offers every evening" },
              { title: "Daily Updates", desc: "Fresh discounts every morning" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-5 shadow-md hover:scale-105 hover:bg-white/20 transition-transform"
              >
                <div className="font-bold text-yellow-300">{item.title}</div>
                <div className="text-sm text-gray-200">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 text-sm mt-6 text-gray-200">
            <span>10K+ Rentals</span>
            <span>1.5K+ Happy Riders</span>
            <span>600+ Verified Bikes</span>
          </div>
        </div>

        {/* Category Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-yellow-300 mb-6">🚲 Shop by Category</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "🚲", label: "City Cruiser" },
              { icon: "⚡", label: "Electric Ride" },
              { icon: "🏔️", label: "Mountain Adventure" },
              { icon: "🛵", label: "Scooty & Mopeds" },
            ].map((cat, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl px-4 py-10 text-center text-white hover:bg-white/20 hover:scale-105 transition"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-yellow-300 mb-3">Ride More. Spend Less.</h2>
          <p className="text-gray-200 mb-6">Limited-time offers available. Book now before prices go up!</p>
          <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">
            Explore Bikes Now
          </button>
        </div>
      </div>
    </div>
  );
}
