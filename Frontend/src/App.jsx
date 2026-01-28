import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
// import ReadyToRide from "./pages/ReadyToRide";
import Login from "./pages/Login";
import Register from "./pages/Register";
 import OwnerReview from "./pages/ownerReview";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import FAQPage from "./pages/FAQpage"; // Adjust the path if needed

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/bikes" element={<Bikes />} /> */}
        <Route path="/bike/:id" element={<BikeDetails />} />
        {/* <Route path="/ready" element={<ReadyToRide />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/owner/reviews" element={<OwnerReview />} />
        <Route path="/reviews" element={<Reviews />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bike/:id" element={<BikeDetails />} />
      <Route path="/mybookings" element={<MyBookings />} />

      
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/renter-dashboard" element={<RenterDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
