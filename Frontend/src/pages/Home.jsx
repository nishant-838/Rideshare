import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import HowItWorks from "../components/HowItWorks";
import FeaturedBikes from "../components/FeaturedBikes";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <>
     <Navbar/>
    <div className="pt-20">
      <Header />
      <Banner />
      <HowItWorks />
      <FeaturedBikes />
      <Footer />
    </div>
    </>
  );
}
