import { Link } from "react-router-dom";
import sampleImg from "../../../assets/images/zang.jpg";
import backgroundimage from "../../../assets/images/Home.jpg";
import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    sampleImg, // Add other images here
    backgroundimage,
    sampleImg, // Add other images here
  ];

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change image every 5 seconds

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, []);

  return (
    <section
      id="welcome"
      className="h-screen flex flex-col md:flex-row items-center justify-center bg-primary px-6 md:px-16 lg:px-24 py-10 gap-10 relative"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Overlay with mutedPrimary color */}
      <div
        className="absolute inset-0 bg-primary opacity-70"
      
      ></div>

      {/* Left Content */}
      <div className="flex flex-col gap-6 text-center md:text-left max-w-lg z-10">
        <h3 className="text-3xl md:text-4xl font-bold text-secondary">
          The Power of Innovation
        </h3>

        <p className="text-mutedSecondary text-base md:text-lg leading-relaxed">
          Innovation is the key to unlocking a sustainable future. Our
          commitment to harnessing cutting-edge technologies and creative
          solutions empowers communities to thrive while protecting our planet.
        </p>

        <TypeAnimation
          sequence={[
            'We produce high quality power banks',
            1000,
            'We produce USB cables',
            1000,
            'We Produce Solar Lanterns',
            1000,
            'We Produce Mobile Phone Chargers',
            1000,
            'We offer Quality and Reliable Services',
            1000,
            'We offer green skills training programs to marginalized communities',
            1000,
            'We recycle e-waste into sustainable products',
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '1.5em', display: 'inline-block', color: "#eddb17", fontWeight: "bold" }}
          repeat={Infinity}
        />

       
      </div>

      {/* Right Content (Random but Suitable Content) */}
      <div className="flex flex-col items-center justify-center z-10 text-center border-[1px]  lg:hover:scale-105 transition-all delay-75 ease-in-out bg-white/40 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-primary mb-4">Our Latest Product</h2>
        <p className="text-mutedSecondary mb-6">
          Explore our new range of eco-friendly power solutions designed to power your devices while protecting the planet. Discover more today!
        </p>
        <Link to={"/store"} className="bg-secondary text-primary px-4 py-2 rounded-md font-semibold transition duration-300 hover:bg-opacity-80">
          Shop Now 
        </Link>
      </div>
    </section>
  );
}

export default Hero;



