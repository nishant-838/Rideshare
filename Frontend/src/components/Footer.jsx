import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-blue-900 via-blue-950 to-black text-gray-300 pt-12 pb-6 px-6 md:px-16 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">

        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">RideOn Rentals</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Rent bikes and scooties hassle-free. Explore your city or weekend
            getaways with comfort, style, and freedom.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li><a href="#availability" className="hover:text-cyan-400 transition">Check Availability</a></li>
            <li><a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a></li>
            <li><a href="#reviews" className="hover:text-cyan-400 transition">Reviews</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition">Contact Us</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-2"><MapPin size={18}/> MG Road, Bengaluru</li>
            <li className="flex items-center gap-2"><Phone size={18}/> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={18}/> support@rideon.com</li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cyan-400 transition"><Facebook /></a>
            <a href="#" className="hover:text-cyan-400 transition"><Instagram /></a>
            <a href="#" className="hover:text-cyan-400 transition"><Twitter /></a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>
          © {new Date().getFullYear()} <span className="text-cyan-400 font-semibold">RideOn Rentals</span>. 
          All rights reserved.
        </p>
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500"></div>
    </footer>
  );
}
