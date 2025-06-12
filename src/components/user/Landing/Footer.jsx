import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/whiteLogo.png";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5 md:px-20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Column 1 */}
        <div>
          <img
            src={logo}
            height={60}
            width={150}
            alt="Zang Global Logo"
            className="object-contain"
          />
          <p className="text-sm mt-2 opacity-75">The Power of Innovation</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/#welcome"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/#partners"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Partners and Supporters
              </a>
            </li>
           
            <li>
              <Link
                to="/blogs"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Blog
              </Link>
            </li>
            <li>
              <a
                href="/store"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Technology */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Technology</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/blog/11"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Manufacturing
              </Link>
            </li>
            <li>
              <Link
                to="/blog/12"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Circular Economy
              </Link>
            </li>
            <li>
              <Link
                to="/training"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Training Hub
              </Link>
            </li>
            <li>
              <Link
                to="/blog/1"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Assistive Tech
              </Link>
            </li>

          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
          <li>
              <a
                href="/#awards"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Awards and Recognition
              </a>
            </li><li>
              <a
                href="/#team"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Team
              </a>
            </li>
            <li>
              <a
                href="/#why-us"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Why Us
              </a>
            </li>
            <li>
              <a
                href="/#achievements"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                Achievements
              </a>
            </li>
            <li>
              <a
                href="/#about"
                className="hover:underline hover:text-mutedSecondary transition duration-200"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.facebook.com/zangglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/zangglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.x.com/zangglobal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/company/zang-global"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between justify-center w-full flex-wrap">
        {/* Newsletter / Social */}
        <div className="mt-10 bg-gray-200/20 w-fit p-10 rounded-md shadow-md shadow-gray-300/30">
          <h3 className="text-lg font-semibold mb-4">Stay in Touch</h3>
          <p className="text-sm mb-4">Get the latest updates, offers & more.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 text-sm rounded-md focus:outline-none text-black flex-1"
            />
            <button className="bg-secondary text-primary font-semibold px-4 py-2 text-sm rounded-md hover:bg-opacity-80 transition">
              Subscribe
            </button>
          </form>
        </div>        <div className="text-center flex flex-col items-center mt-10 sm:text-left">
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <p className="text-sm opacity-75">
            No. 4 Lion Gate IV Plaza Opposite ITF Centre for Excellence, Bukuru
            Express Way, Jos, Plateau State, Nigeria
          </p>
          <p className="text-sm opacity-75 mt-3">
            Tel:{" "}
            <a
              href="tel:+2349031743810"
              className="hover:text-gray-300 underline underline-offset-2"
            >
              +2349031743810, +2347016705792
            </a>
          </p>
          <p className="text-sm opacity-75">
            Email:{" "}
            <a
              href="mailto:info@zangglobal.com"
              className="hover:text-gray-300 underline underline-offset-2"
            >
              info@zangglobal.com
            </a>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <FaWhatsapp
              size={20}
              className="hover:text-green-400 transition-colors"
            />
            <span className="text-sm opacity-75">+2348101496175</span>
          </div>
        </div>


       
      </div>

      {/* Copyright */}

      <div className="mt-10 text-center text-sm border-t border-mutedPrimary pt-5">
        &copy; {new Date().getFullYear()} Your Company Name. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
