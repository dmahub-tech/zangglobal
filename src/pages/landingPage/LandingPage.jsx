import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Carousel from "../../components/user/Carousel";
import { whyUs } from "../../constants";
import { motion } from "framer-motion";
import ContactUs from "../user/contact";
import Hero from "../../components/Landing/Hero";
import About from "../../components/Landing/About";
import PartnersAndAwards from "../../components/Landing/PartnersAndAwards";
import OurTeam from "../../components/Landing/Team";
import EventLanding from "../../components/Landing/EventSection";
import VolunteerSection from "../../components/Landing/VoluteerSection";

const LandingPage = () => {
  const Counter = ({ startValue, endValue }) => {
    const [count, setCount] = useState(startValue);

    const startCounting = () => {
      setCount(startValue); // Reset count to start value
      let current = startValue;
      const end = parseInt(endValue);
      if (current === end) return;

      // Calculate duration based on the range
      const range = end - startValue;
      const totalDuration = 1000; // 1 second total
      const incrementTime = totalDuration / range;

      let timer = setInterval(() => {
        current += 1;
        setCount(current);
        if (current === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    };

    return (
      <motion.span
        whileInView={{ scale: 1.2 }}
        transition={{ duration: 0.5 }}
        onViewportEnter={startCounting}
      >
        {count}+
      </motion.span>
    );
  };

  const Achievements = () => {
    return (
      <section
        id="achievements"
        className="w-full h-screen md:h-[60vh] flex flex-col bg-primary px-6 md:px-10 items-center justify-center py-16"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-secondary mb-8"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Achievements
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <motion.div
            className="bg-mutedSecondary text-background py-10 rounded-lg flex flex-col items-center shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Counter startValue={1300} endValue={1600} />
            <p>Tons of e-waste diverted from landfill </p>
          </motion.div>

          <motion.div
            className="bg-mutedSecondary text-background py-10 rounded-lg flex flex-col items-center shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Counter startValue={4000} endValue={4294} />
            <p>Sustainable product users</p>
          </motion.div>

          <motion.div
            className="bg-mutedSecondary text-background py-10 rounded-lg flex flex-col items-center shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Counter startValue={0} endValue={300} />
            <p>Trained IDPs on green skills </p>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <main className="md:px-2">
      {/* <Navbar /> */}
      <Hero />

      {/* <EventLanding /> */}

      {/* <VolunteerSection /> */}
      {/* why us */}
      <section
        id="why-us"
        className="bg-mutedSecondary text-primary flex flex-col items-center justify-center md:h-[70vh] p-16 w-full"
      >
        <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
        <p className="text-center max-w-2xl">
          We offer high-quality power solutions that keep you connected at all
          times.
        </p>
        <div className="flex flex-wrap gap-5 justify-center mt-6">
          {whyUs.map((item, index) => (
            <div
              className="bg-primary md:p-4 p-4 text-secondary font-bold rounded-md border border-secondary flex items-center flex-col shadow-md md:w-40 w-60 text-center"
              key={index}
            >
              <FaCheckCircle size={35} />
              <p className="text-center text-xs md:text-lg">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <Achievements />

      {/* Carousel */}
      <section className=" bg-primary">
        <Carousel />
      </section>
      <About />

      <div id="contact">
        <ContactUs />
      </div>

      <OurTeam />
      <PartnersAndAwards />
      {/* <Footer /> */}
    </main>
  );
};

export default LandingPage;
