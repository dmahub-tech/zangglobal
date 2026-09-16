import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Landing/LandingNavBar";
import Footer from "../components/Landing/Footer";

const MainLayout = ({ title, navs }) => {
  return (
    <main className="">
      <Navbar />
      <div className="">
        <Outlet />
        <Footer />
      </div>
    </main>
  );
};

export default MainLayout;
