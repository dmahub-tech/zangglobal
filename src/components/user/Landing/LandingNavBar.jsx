import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../assets/images/logoYellow.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setDropdownOpen(null);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-secondary shadow-lg py-4 px-5 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Company Logo"
          width={100}
          height={50}
          loading="lazy"
          className="h-auto"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 font-medium relative items-center">
        <a
          href="/#welcome"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Home
        </a>

        {/* Technology Dropdown */}
        <div className="relative dropdown">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("Technology");
            }}
            className="hover:text-mutedSecondary"
          >
            Technology ▾
          </button>
          <div
            className={`absolute left-[-60px] mt-2 min-w-[180px] bg-mutedSecondary text-gray-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 z-50 ${
              dropdownOpen === "Technology"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <Link
              to="/blog/11"
              className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Manufacturing
            </Link>
            <Link
              to="/blog/12"
              className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Circular Economy
            </Link>
            <Link
              to="/training"
              className="block px-5  border-b-[1px] border-mutedPrimary  py-3 text-sm hover:bg-gray-100 hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Training Hub
            </Link>
            <Link
              to="/blog/1"
              className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Assistive Tech
            </Link>
          </div>
        </div>

        {/* Company Dropdown */}
        <div className="relative dropdown">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("Company");
            }}
            className="hover:text-mutedSecondary"
          >
            About Us ▾
          </button>
          <div
            className={`absolute left-0 mt-2 min-w-[180px] bg-mutedSecondary text-gray-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 z-50 ${
              dropdownOpen === "Company"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <a
              href="/#why-us"
              className="block px-5 py-3 text-sm hover:bg-gray-100 hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Why Us
            </a>
            <a
              href="/#achievements"
              className="block px-5 py-3 border-y-[1px] border-mutedPrimary text-sm hover:bg-gray-100 hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              Achievements
            </a>
            <a
              href="/#about"
              className="block px-5 py-3 text-sm hover:bg-gray-100 hover:text-primary transition duration-200"
              onClick={closeMenu}
            >
              About Us
            </a>
          </div>
        </div>

        <a
          href="/#contact"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Contact
        </a>
        <a
          href="/store"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Shop
        </a>
        <Link
          to="/blogs"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Blog
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="md:hidden text-secondary text-3xl"
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-primary text-secondary shadow-lg flex flex-col items-start px-6 py-10 space-y-4 z-50 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <a
          href="/#welcome"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Home
        </a>
        {/* Technology Dropdown Mobile */}
        <div className="w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("Technology");
            }}
            className="w-full text-left hover:text-mutedSecondary"
          >
            Technology ▾
          </button>
          {dropdownOpen === "Technology" && (
            <div className="flex flex-col text-sm bg-mutedSecondary text-primary rounded-md overflow-hidden transition duration-300">
              <Link
                to="/blog/11"
                className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
                onClick={closeMenu}
              >
                Manufacturing
              </Link>
              <Link
                to="/blog/12"
                className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
                onClick={closeMenu}
              >
                Circular Economy
              </Link>
              <Link
                to="/training"
                className="block px-5  border-b-[1px] border-mutedPrimary  py-3 text-sm hover:bg-gray-100 hover:text-primary transition duration-200"
                onClick={closeMenu}
              >
                Training Hub
              </Link>
              <Link
                to="/blog/1"
                className="block px-5 py-3 text-sm hover:bg-gray-100  border-b-[1px] border-mutedPrimary hover:text-primary transition duration-200"
                onClick={closeMenu}
              >
                Assistive Tech
              </Link>
            </div>
          )}
        </div>


        {/* Company Dropdown Mobile */}
        <div className="w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("Company");
            }}
            className="w-full text-left hover:text-mutedSecondary"
          >
            Company ▾
          </button>
          {dropdownOpen === "Company" && (
            <div className="flex flex-col text-sm bg-mutedSecondary text-primary rounded-md transition duration-300">
              <a
                href="/#why-us"
                className="px-4 py-2 border-b-[1px] border-mutedPrimary hover:bg-gray-100"
                onClick={closeMenu}
              >
                Why Us
              </a>
              <a
                href="/#achievements"
                className="px-4 py-2 border-b-[1px] border-mutedPrimary hover:bg-gray-100"
                onClick={closeMenu}
              >
                Achievements
              </a>
              <a
                href="/#about"
                className="px-4 py-2 border-b-[1px] border-mutedPrimary hover:bg-gray-100"
                onClick={closeMenu}
              >
                About Us
              </a>
            </div>
          )}
        </div>

        <a
          href="/store"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Shop
        </a>

        <a
          href="/#contact"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Contact
        </a>
        <Link
          to="/blogs"
          className="hover:text-mutedSecondary"
          onClick={closeMenu}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
