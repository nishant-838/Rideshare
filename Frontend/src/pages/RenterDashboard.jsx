import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bike,
  Star,
  Heart,
  Search,
  ChevronDown,
  RefreshCw,
  Clock,
  CreditCard,
} from "lucide-react";
import api from "../api/axios";

/* ---------- Helpers ---------- */

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hh, mm] = timeStr.split(":").map((s) => parseInt(s, 10));
  return hh * 60 + (mm || 0);
};

const getDurationHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  let diff = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
  if (diff <= 0) diff += 24 * 60;
  return diff / 60;
};

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/* ---------- Component ---------- */

export default function RenterDashboard() {
  const navigate = useNavigate();

  /* ---------- State ---------- */
  const stored = JSON.parse(localStorage.getItem("searchFilters")) || {
    pickupDate: "",
    pickupTime: "",
    dropTime: "",
  };

  const [filters, setFilters] = useState(stored);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [bikeType, setBikeType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteBikes") || "[]")
  );
  const [retryTrigger, setRetryTrigger] = useState(0);

  /* ---------- Effects ---------- */

  // update filters from localStorage externally
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "searchFilters") {
        const newFilters = JSON.parse(e.newValue) || stored;
        setFilters(newFilters);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // fetch bikes
  useEffect(() => {
    const fetchAvailableBikes = async () => {
      setLoading(true);
      setError("");

      if (!filters.pickupDate || !filters.pickupTime || !filters.dropTime) {
        setError("Please select pickup and drop times before viewing bikes.");
        setLoading(false);
        setBikes([]);
        return;
      }

      try {
        const res = await api.get("/bikes/available", {
          params: {
            date: filters.pickupDate,
            startTime: filters.pickupTime,
            endTime: filters.dropTime,
          },
          timeout: 10000,
        });

        setBikes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching bikes:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load available bikes. Check backend or network."
        );
        setBikes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableBikes();
  }, [filters.pickupDate, filters.pickupTime, filters.dropTime, retryTrigger]);

  /* ---------- Derived ---------- */

  const durationHours = useMemo(
    () => getDurationHours(filters.pickupTime, filters.dropTime),
    [filters.pickupTime, filters.dropTime]
  );

  // dynamic bike types from data
  const bikeTypesFromData = useMemo(() => {
    const set = new Set();
    bikes.forEach((b) => {
      if (b.vehicleType) set.add(b.vehicleType.toLowerCase());
    });
    return Array.from(set);
  }, [bikes]);

  // filtered & sorted bikes
  const displayedBikes = useMemo(() => {
    const [minP, maxP] = priceRange;
    const q = query.trim().toLowerCase();
    const typeFilter = bikeType.toLowerCase();

    let arr = bikes.filter((b) => {
      const priceOK = b.pricePerHour >= minP && b.pricePerHour <= maxP;
      const typeOK =
        typeFilter === "all" ||
        (b.vehicleType && b.vehicleType.toLowerCase() === typeFilter);
      const queryOK =
        !q ||
        (b.bikeName && b.bikeName.toLowerCase().includes(q)) ||
        (b.brand && b.brand.toLowerCase().includes(q));

      return priceOK && typeOK && queryOK;
    });

    if (sortBy === "price-asc") arr.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sortBy === "price-desc") arr.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sortBy === "name") arr.sort((a, b) => (a.bikeName || "").localeCompare(b.bikeName || ""));
    else
      arr.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0) || a.pricePerHour - b.pricePerHour
      );

    return arr;
  }, [bikes, priceRange, bikeType, query, sortBy]);

  /* ---------- Handlers ---------- */

  const toggleFavorite = (id) => {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("favoriteBikes", JSON.stringify(next));
  };

  const handleRetry = () => {
    setError("");
    setRetryTrigger((t) => t + 1);
  };

  const clearAndGoSelect = () => {
    localStorage.removeItem("searchFilters");
    window.location.href = "/";
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 flex items-center gap-3">
              <Bike className="w-9 h-9 text-blue-600" />
              Available Bikes
            </h1>
            <p className="text-gray-600 mt-1">
              Showing options for{" "}
              <strong className="text-blue-700">{filters.pickupDate || "—"}</strong>{" "}
              from{" "}
              <strong className="text-blue-700">{filters.pickupTime || "—"}</strong>{" "}
              to{" "}
              <strong className="text-blue-700">{filters.dropTime || "—"}</strong> •{" "}
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />{" "}
                {durationHours ? `${durationHours.toFixed(2)} hr` : "—"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearAndGoSelect}
              className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
              title="Change pickup/drop time"
            >
              <ChevronDown className="w-4 h-4" />
              Change Pickup/Drop Time
            </button>

            <button
              onClick={() => setRetryTrigger((t) => t + 1)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search + Sort */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bike name or brand..."
                  className="pl-10 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-40 border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name (A → Z)</option>
              </select>
            </div>

            {/* Bike type */}
            <div className="col-span-1 md:col-span-1 flex items-center gap-2">
  <select
    value={bikeType}
    onChange={(e) => setBikeType(e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2"
  >
    <option value="all">All Types</option>
    <option value="scooty">Scooty</option>
    <option value="bike">Bike</option>
    <option value="sports">Sports</option>
    <option value="electric">Electric</option>
  </select>
</div>


            {/* Price range */}
            <div className="col-span-1 md:col-span-1 flex items-center gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>Price / hr (₹)</span>
                  <span className="font-medium">
                    {priceRange[0]} - {priceRange[1]}
                  </span>
                </div>

                {/* Min */}
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        clamp(Number(e.target.value || 0), 0, priceRange[1]),
                        priceRange[1],
                      ])
                    }
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={10}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="flex-1"
                  />
                </div>

                {/* Max */}
                <div className="flex gap-2 mt-2 items-center">
                  <input
                    type="number"
                    min={0}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        clamp(Number(e.target.value || 5000), priceRange[0], 5000),
                      ])
                    }
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Error / Empty handling */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full p-2">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeOpacity="0.2"
                  />
                  <path
                    d="M45 25a20 20 0 0 0-20-20"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-3 text-gray-600 text-lg">Loading available bikes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
              <button
                onClick={clearAndGoSelect}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg"
              >
                Change Time
              </button>
            </div>
          </div>
        ) : displayedBikes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="mx-auto max-w-md">
              <img
                src="https://cdn.jsdelivr.net/gh/creativetimofficial/public-assets@main/illustrations/empty-state.svg"
                alt="No results"
                className="w-48 mx-auto mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No bikes found
              </h3>
              <p className="text-gray-500 mb-4">
                Try widening the price range or change the pickup/drop times.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setPriceRange([0, Math.max(1000, priceRange[1] * 2)]);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Widen Price Range
                </button>
                <button
                  onClick={clearAndGoSelect}
                  className="bg-white border border-gray-200 px-4 py-2 rounded-lg"
                >
                  Change Times
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Bikes Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBikes.map((b) => {
              const isFav = favorites.includes(b._id);
              const estTotal = Math.max(
                0,
                Math.round((b.pricePerHour || 0) * durationHours * 100) / 100
              );

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-xl shadow hover:shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={b.image || "https://via.placeholder.com/600x360?text=Bike"}
                      alt={b.bikeName}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(b._id)}
                      className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:scale-105 transition"
                      title={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-5 h-5 ${isFav ? "text-red-500" : "text-gray-600"}`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{b.bikeName}</h3>
                        <p className="text-sm text-gray-500">{b.brand || b.vehicleType || "Bike"}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <div className="inline-flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{(b.rating || 0).toFixed(1)}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{b.mileage ? `${b.mileage} km/l` : "N/A"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-700 font-semibold text-lg">
                          ₹{b.pricePerHour}/hr
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Est: ₹{estTotal}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/bike/${b._id}`)}
                      className="mt-4 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
