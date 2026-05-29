import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BikeDetails from "./pages/BikeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerReview from "./pages/ownerReview";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import CustomerMap from "./pages/CustomerMap";
import DriverTracker from "./pages/DriverTracker";
import FAQPage from "./pages/FAQpage"; 

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Consumer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* Tracking & Live Location Routes */}
        {/* 🚀 Clicking "Go Live" brings the user here to transmit GPS data */}
        <Route path="/tracker" element={<DriverTracker />} /> 
        <Route path="/track-bike" element={<CustomerMap />} />
        <Route path="/track-ride" element={<DriverTracker />} />

        {/* Dashboards & Administration */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/renter-dashboard" element={<RenterDashboard />} />
        <Route path="/owner/reviews" element={<OwnerReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;