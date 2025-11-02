import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import bikeBg from "../assets/review.jpg"; // 🖼️ Add a bike photo here

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      name: "Rahul Mehta",
      rating: 5,
      comment: "Excellent service! The bike was clean and well maintained. Definitely renting again!",
      date: "Oct 10, 2025",
    },
    {
      name: "Sneha Kapoor",
      rating: 4,
      comment: "Smooth process and quick pickup. Loved the electric scooty for city rides!",
      date: "Oct 20, 2025",
    },
  ]);

  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment && newReview.rating > 0) {
      setReviews([...reviews, { ...newReview, date: new Date().toDateString() }]);
      setNewReview({ name: "", rating: 0, comment: "" });
    } else {
      alert("Please fill out all fields and give a rating!");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${
          bikeBg ||
          "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
        })`,
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-16 px-6 text-white">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-2">
          What Riders Say 🏍️
        </h1>
        <p className="text-center text-gray-200 mb-10">
          Real reviews from real college riders who’ve used our service.
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-md hover:scale-[1.02] transition"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-yellow-400 text-black font-bold flex items-center justify-center rounded-full">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-lg">{review.name}</h4>
                  <p className="text-sm text-gray-300">{review.date}</p>
                </div>
              </div>

              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-100 text-sm">{review.comment}</p>
            </motion.div>
          ))}
        </div>

        {/* Submit New Review */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Share Your Experience</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <textarea
              placeholder="Write your review..."
              rows={3}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <div className="flex items-center space-x-2">
              <span className="text-gray-200 mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`cursor-pointer transition ${
                    newReview.rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
