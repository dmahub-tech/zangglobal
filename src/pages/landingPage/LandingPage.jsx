import React, { useState } from "react";
import { FaCheckCircle} from "react-icons/fa";
import Carousel from "../../components/user/Carousel";
import { whyUs } from "../../constants";
import { motion } from "framer-motion";
import ContactUs from "../user/contact";
import Hero from "../../components/user/Landing/Hero";
import About from "../../components/user/Landing/About";
import PartnersAndAwards from "../../components/user/Landing/PartnersAndAwards";
import OurTeam from "../../components/user/Landing/Team";


const LandingPage = () => {

  const Counter = ({ value }) => {
    const [count, setCount] = useState(0);
  
    const startCounting = () => {
      setCount(0); // Reset count before starting again
      let start = 0;
      const end = parseInt(value);
      if (start === end) return;
  
      let totalDuration = 1000;
      let incrementTime = totalDuration / end;
      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
  
      return () => clearInterval(timer);
    };
  
    return (
      <motion.span
        whileInView={{ scale: 1.2 }}
        transition={{ duration: 0.5 }}
        onViewportEnter={startCounting} // Restart count on entering viewport
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
            <Counter value={1600} />
            <p>Tons of e-waste diverted from landfill </p>
          </motion.div>
  
          <motion.div
            className="bg-mutedSecondary text-background py-10 rounded-lg flex flex-col items-center shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Counter value={40000} />
            <p>Sustainable product users</p>
          </motion.div>
  
          <motion.div
            className="bg-mutedSecondary text-background py-10 rounded-lg flex flex-col items-center shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Counter value={300} />
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

      {/* why us */}
      <section id="why-us" className="bg-mutedSecondary text-primary flex flex-col items-center justify-center md:h-[70vh] p-16 w-full">
        <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
        <p className="text-center max-w-2xl">We offer high-quality power solutions that keep you connected at all times.</p>
        <div className="flex flex-wrap gap-5 justify-center mt-6">
          {whyUs.map((item, index) => (
            <div className="bg-primary md:p-4 p-4 text-secondary font-bold rounded-md border border-secondary flex items-center flex-col shadow-md md:w-40 w-60 text-center" key={index}>
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





