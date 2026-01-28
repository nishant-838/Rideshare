import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/profileNavbar";
import Footer from "../components/Footer";
import bg from "../images/marathon.png"; // your background image

/* ---------- FAQ Item Component ---------- */
function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 bg-blue-50 hover:bg-blue-100 flex justify-between items-center font-semibold text-blue-800 text-lg"
      >
        {question}
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-4 text-gray-700 bg-white"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- FAQ Page Component ---------- */
export default function FAQPage() {
  const faqList = [
    {
      q: "How do I book a bike?",
      a: "Select your pickup and drop times, browse available bikes, and click 'Book Now' to reserve your bike.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes, you can cancel your booking up to 1 hour before your scheduled pickup time.",
    },
    {
      q: "Is there a refund after cancellation?",
      a: "If you cancel within the allowed time window, your payment will be refunded automatically.",
    },
    {
      q: "How do I rate a bike after using it?",
      a: "After completing your booking, go to your 'Bookings' page and click 'Rate Bike' to give feedback.",
    },
    {
      q: "Can I extend my rental time?",
      a: "Yes, you can request an extension up to 2 hours after your original drop-off time, depending on availability.",
    },
    {
      q: "Are helmets included?",
      a: "All bikes come with helmets. Safety is a priority.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      style={{
        backgroundImage: `url(${bg})`, // Corrected
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqList.map((item, index) => (
            <FAQItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>

        <div className="mt-12 text-center text-red-500">
          <p>
            Still have questions? Contact our support team at{" "}
            <span className="text-black font-medium">
              support@bikerental.com
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
