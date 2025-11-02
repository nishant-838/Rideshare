import React from "react";
import { motion } from "framer-motion";
import BikeCard from "./BikeCard";

// Local images (add your actual image paths)
import bike1 from "../assets/bike1.jpg";
import scooty1 from "../assets/scooty1.jpg";
import electric1 from "../assets/electric1.jpg";

const bikes = [
  {
    name: "Royal Enfield Hunter 350",
    type: "Bike",
    price: 12,
    location: "Campus Main Gate",
    distance: "0.5 km",
    tags: ["Available Now", "Popular"],
    image: bike1,
  },
  {
    name: "Ola S1 Pro",
    type: "Electric Scooty",
    price: 10,
    location: "Engineering Block",
    distance: "0.8 km",
    tags: ["Electric", "Eco-Friendly"],
    image: electric1,
  },
  {
    name: "TVS Jupiter",
    type: "Scooty",
    price: 7,
    location: "Hostel Parking",
    distance: "0.4 km",
    tags: ["Affordable", "Comfort Ride"],
    image: scooty1,
  },
];

export default function FeaturedBikes() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">
          🚲 Featured <span className="text-indigo-600">Bikes & Scooties</span>
        </h2>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <BikeCard {...bike} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
