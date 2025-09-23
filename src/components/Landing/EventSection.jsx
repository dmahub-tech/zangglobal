import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Play,
  Users,
  Lightbulb,
  Award,
  Clock,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

const EventLanding = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const countDownDate = new Date("Nov 2, 2025 10:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const FloatingParticle = ({ delay, duration, size }) => (
    <div
      className={`absolute bg-secondary rounded-full opacity-20 animate-pulse`}
      style={{
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: duration,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );

  const highlights = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Revolutionary Products",
      description:
        "Experience cutting-edge innovations that will reshape the future of technology",
      color: "secondary",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Premium Exhibition",
      description:
        "Interactive displays featuring the latest breakthroughs from industry pioneers",
      color: "accent",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Elite Networking",
      description:
        "Connect with visionaries, investors, and thought leaders shaping tomorrow",
      color: "primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent rounded-full opacity-25 mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={`${i * 0.5}s`}
            duration={`${3 + i * 0.5}s`}
            size={`${8 + Math.random() * 16}px`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative py-10 md:py-5">
        <div className="container mx-auto px-2 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-primary rounded-full mb-8 shadow-2xl border border-mutedPrimary/30 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2 text-secondary" />
              <span className="text-sm font-bold tracking-wider text-white uppercase">
                Exclusive Launch Event • Nov 2, 2025
              </span>
              <Zap className="w-4 h-4 ml-2 text-secondary" />
            </div>

            {/* Main Heading with Brand Colors */}
            <h1 className="text-xl md:text-3xl lg:text-5xl font-black mb-6 leading-tight">
              <span className="text-secondary animate-pulse drop-shadow-lg">
                Zang Global
              </span>
              <br />
              <span className="text-3xl md:text-2xl font-light text-white">
                Product Revolution
              </span>
            </h1>

            {/* Dynamic Subheading */}
            <p className="text-xl md:text-2xl lg:text-3xl text-mutedSecondary mb-12 max-w-4xl leading-relaxed">
              Where{" "}
              <span className="text-accent font-semibold">
                Innovation Meets Impact
              </span>{" "}
              - An immersive experience of groundbreaking technology and
              meaningful connections
            </p>

            {/* Enhanced Countdown Timer */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-12 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-secondary mr-3" />
                <h3 className="text-lg font-bold text-secondary">
                  Event Coming in...
                </h3>
              </div>
              <div className="flex justify-center space-x-6 md:space-x-8">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                      <div className="relative w-20 h-20 md:w-18 md:h-18 rounded-xl bg-primary border border-mutedPrimary flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:bg-mutedPrimary transition-all duration-300">
                        <span className="text-lg md:text-2xl font-black text-white">
                          {value.toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm mt-3 text-neutralGray font-medium capitalize tracking-wide">
                      {unit}
                    </span>
                  </div>
                ))}
              </div>

            </div>
              <Link className="bg-secondary text-primary  px-5 rounded-full font-semibold py-3" to={"/event-register"}>Register Now! </Link>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="relative py-8 bg-black/30 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center group cursor-pointer">
              <div className="p-3 bg-primary rounded-full mr-4 group-hover:scale-110 group-hover:bg-mutedPrimary transition-all duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">
                  November 2, 2025
                </h3>
                <p className="text-mutedSecondary">10:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-center justify-center group cursor-pointer">
              <div className="p-3 bg-accent rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-accent">
                  Usiju World Centre
                </h3>
                <p className="text-mutedSecondary">Jos, Nigeria</p>
              </div>
            </div>

            <div className="flex items-center justify-center group cursor-pointer">
              <div className="p-3 bg-secondary rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-6 w-6 text-background" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">
                  Hybrid Format
                </h3>
                <p className="text-mutedSecondary">In-Person & Virtual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Highlights Section */}
      <div className="py-14 md:py-18">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-3xl font-black mb-6 text-secondary drop-shadow-lg">
              Why This Changes Everything
            </h2>
            <p className="text-md md:text-lg text-mutedSecondary max-w-4xl mx-auto leading-relaxed">
              Step into the future of innovation where groundbreaking technology
              meets unlimited potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`absolute inset-0 bg-${highlight.color}/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                ></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-white/20">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 ${
                      highlight.color === "secondary"
                        ? "bg-secondary text-background"
                        : highlight.color === "accent"
                        ? "bg-accent text-white"
                        : "bg-primary text-white"
                    } rounded-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {highlight.icon}
                  </div>
                  <h3
                    className={`text-xl font-bold text-white mb-4 group-hover:${
                      highlight.color === "secondary"
                        ? "text-secondary"
                        : highlight.color === "accent"
                        ? "text-accent"
                        : "text-primary"
                    } transition-colors`}
                  >
                    {highlight.title}
                  </h3>
                  <p className="text-mutedSecondary text leading-relaxed">
                    {highlight.description}
                  </p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Section with Brand Colors */}
      <div className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-secondary drop-shadow-lg">
                World-Class Venue
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 bg-accent rounded-full mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-2">
                      Usiju World Event Centre
                    </h3>
                    <p className="text-mutedSecondary">
                      Off State Secretariat Junction by Apollo Crescent, Jos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    "Premium facilities & amenities",
                    "Ample parking available",
                    "Easy transportation access",
                    "State-of-the-art technology",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                      <span className="text-mutedSecondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative bg-primary/20 rounded-3xl overflow-hidden backdrop-blur-sm border border-mutedPrimary/30 shadow-2xl h-64 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.4861582631434!2d8.874916875793472!3d9.893405874858255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10537374ffaef1e5%3A0x15441f6a78671188!2sUsiju%20Events%20Centre!5e0!3m2!1sen!2sng!4v1757835605497!5m2!1sen!2sng"
                  width="600"
                  height="450"
                  style={{border:0}}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLanding;
