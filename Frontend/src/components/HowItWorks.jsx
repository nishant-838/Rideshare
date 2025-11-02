import React from "react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: "📱",
      title: "Book Your Ride",
      description:
        "Choose your favorite bike or scooty, select pickup location, and confirm your booking instantly through our app or website.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: "🏍️",
      title: "Pick Up & Ride",
      description:
        "Collect your vehicle from the nearest rental point and head out for your trip — city rides, outings, or weekend getaways!",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "💳",
      title: "Return & Pay Securely",
      description:
        "Return the vehicle at the selected drop-off point and complete payment online with instant billing and applied discounts.",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-blue-100 text-center relative overflow-hidden">
      {/* Background Image (Blurred) */}
      <img
        src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
        alt="Bike Background"
        className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm"
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-gradient-to-br ${step.gradient} text-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center`}
            >
              <div className="text-6xl mb-4 drop-shadow-lg">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 drop-shadow-md">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed opacity-90 max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
