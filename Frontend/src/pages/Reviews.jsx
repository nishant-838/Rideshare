import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios instance
import bikeBg from "../assets/review.jpg"; // background image

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const [hasReviewedToday, setHasReviewedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews");
        const data = Array.isArray(res.data) ? res.data : [];

        // Sort reviews by createdAt (latest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Keep only top 4 latest reviews
        setReviews(sorted.slice(0, 2));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();

    // check if this user has already reviewed today
    const user = JSON.parse(localStorage.getItem("user"));
    const lastReviewDate = localStorage.getItem(`lastReviewDate_${user?.email}`);
    if (lastReviewDate === new Date().toDateString()) {
      setHasReviewedToday(true);
    }
  }, []);

  //  Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasReviewedToday) {
      alert("You have already given feedback today. Try again tomorrow!");
      return;
    }

    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      alert("Please fill out all fields and give a rating!");
      return;
    }

    try {
      const res = await api.post("/reviews", newReview);

      // Add new review to list, sort again, and keep only 4 latest
      setReviews((prev) => {
        const updated = [res.data, ...prev];
        return updated
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
      });

      // Save review date specific to this user
      const user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        `lastReviewDate_${user?.email}`,
        new Date().toDateString()
      );
      setHasReviewedToday(true);

      alert("Thank you for your feedback!");
      navigate("/");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong while submitting your review.");
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-16 px-6 text-white">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-2">
          What Riders Say 🏍
        </h1>
        <p className="text-center text-gray-200 mb-10">
          Real reviews from real college riders who’ve used our service.
        </p>

        {/* Reviews Grid */}
        {loading ? (
          <p className="text-center text-gray-300">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-300 mb-8">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
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
                    <p className="text-sm text-gray-300">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-100 text-sm">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Submit New Review */}
        {!hasReviewedToday && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Share Your Experience
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
              />

              <textarea
                placeholder="Write your review..."
                rows={3}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
              />

              <div className="flex items-center space-x-2">
                <span className="text-gray-200 mr-2">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    onClick={() =>
                      setNewReview({ ...newReview, rating: star })
                    }
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
        )}

        {hasReviewedToday && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center mt-8">
            <h3 className="text-xl font-semibold text-yellow-400">
              You’ve already given feedback today 
            </h3>
            <p className="text-gray-300 mt-2">
              Come back tomorrow to share more experiences!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}