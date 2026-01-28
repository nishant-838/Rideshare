import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, RefreshCw } from "lucide-react";
import api from "../api/axios";
import OwnerNavbar from "../components/ownerNavbar";
import OwnerFooter from "../components/ownerFooter";

export default function OwnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/reviews");
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [retryTrigger]);

  const handleRetry = () => setRetryTrigger((t) => t + 1);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  return (
    <>
      {/* Navbar */}
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              Rider Reviews
            </h1>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block animate-spin rounded-full p-2 border-4 border-t-green-600 border-gray-300"></div>
              <p className="mt-3 text-gray-600">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-red-600 font-medium mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-500">
                No riders have submitted reviews yet.
              </p>
            </div>
          ) : (
            /* Reviews Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedReviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-400 text-black font-bold flex items-center justify-center rounded-full">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      <p className="text-sm text-gray-400">
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
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <OwnerFooter />
    </>
  );
}
