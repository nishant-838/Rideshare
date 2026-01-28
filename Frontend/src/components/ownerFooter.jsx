import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-black text-gray-300 pt-12 pb-6 px-6 md:px-16 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-800 pb-10">

        {/* 🚲 Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-wide">
            RideShare
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Experience convenient and affordable bike & scooty rentals with
            <span className="text-cyan-400 font-medium"> RideShare</span>.
            Your ride, your way — anytime, anywhere.
          </p>
        </motion.div>

        {/* 🔗 Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li><a href="#home" className="hover:text-cyan-400 transition">Home</a></li>
            <li><a href="#vehicles" className="hover:text-cyan-400 transition">Available Vehicles</a></li>
            <li><a href="#offers" className="hover:text-cyan-400 transition">Offers</a></li>
            <li><a href="#reviews" className="hover:text-cyan-400 transition">Reviews</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition">Contact</a></li>
          </ul>
        </motion.div>

        {/* 📍 Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={18} /> JP Nagar, Bengaluru
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@rideshare.com
            </li>
          </ul>
        </motion.div>

        {/* 🌐 Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-5">
            <a
              href="#"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <Facebook />
            </a>
            <a
              href="#"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <Instagram />
            </a>
            <a
              href="#"
              className="hover:text-cyan-400 transition-transform transform hover:scale-110"
            >
              <Twitter />
            </a>
          </div>
        </motion.div>
      </div>

      {/* ⚡ Bottom Bar */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-cyan-400 font-semibold">RideShare</span>. All
          rights reserved.
        </p>
      </div>

      {/* 🌈 Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"></div>
    </footer>
  );
}
