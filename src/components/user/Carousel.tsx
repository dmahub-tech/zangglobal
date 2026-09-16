"use client";

import { testimonialData } from "../../constants";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import React, { useState, useEffect, useCallback } from "react";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialsPerSlide, setTestimonialsPerSlide] = useState(3);
  const slideLength = testimonialData.length;
  const autoScroll = true;
  const intervalTime = 3000;
  let showInterval;

  useEffect(() => {
    const updateTestimonialsPerSlide = () => {
      if (typeof window !== "undefined") {
        setTestimonialsPerSlide(window.innerWidth < 768 ? 1 : 3);
      }
    };
    updateTestimonialsPerSlide();
    window.addEventListener("resize", updateTestimonialsPerSlide);
    return () => window.removeEventListener("resize", updateTestimonialsPerSlide);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + testimonialsPerSlide) % slideLength);
  }, [testimonialsPerSlide, slideLength]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - testimonialsPerSlide + slideLength) % slideLength
    );
  }, [testimonialsPerSlide, slideLength]);

  useEffect(() => {
    if (autoScroll) {
      showInterval = setInterval(handleNext, intervalTime);
    }
    return () => clearInterval(showInterval);
  }, [handleNext]);

  return (
    <div className="relative px-6 pt-8 bg-primary flex items-center justify-center h-auto md:h-[40vh] w-full">
      <button onClick={handlePrev} className="absolute left-4 z-10 p-2 bg-gray-800 text-white rounded-full">
        <LuArrowLeft size={24} />
      </button>

      <div className="flex gap-4 overflow-x-auto max-w-full px-4 sm:px-8 md:px-16 lg:px-32">
        {testimonialData
          .slice(currentIndex, currentIndex + testimonialsPerSlide)
          .map((testimonial, index) => (
            <div
              key={index}
              className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[27rem] h-auto rounded-lg p-6 bg-mutedSecondary shadow-xl flex flex-col gap-8"
            >
              <p className="text-primary text-xs font-semibold">
                {testimonial.statement.length > 100
                  ? `${testimonial.statement.slice(0, 180)}...`
                  : testimonial.statement}
              </p>
              <div className="flex justify-start items-center gap-2">
                <div className="w-[4rem] h-[4rem] overflow-hidden relative flex justify-center items-center">
                  <img src={testimonial.img} alt="partner" className="rounded-full" />
                </div>
                <div className="font-medium flex flex-col gap-1">
                  <h3 className="text-background text-sm font-semibold">
                    {testimonial.name}
                  </h3>
                  <span className="text-background text-xs">
                    {testimonial.services}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <button onClick={handleNext} className="absolute right-4 z-10 p-2 bg-gray-800 text-white rounded-full">
        <LuArrowRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
