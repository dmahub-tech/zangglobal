import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/images/logoYellow.png";

// ✅ Reordered navigation structure
const navItems = {
  main: [
    { path: "/#welcome", label: "Home" },
  ],
  dropdowns: [
    {
      key: "technology",
      label: "Technology",
      items: [
        { path: "/initiatives/11", label: "Manufacturing" },
        { path: "/initiatives/12", label: "Circular Economy" },
        { path: "/training", label: "Training Hub" },
        { path: "/initiatives/1", label: "Assistive Tech" },
      ],
    },
    {
      key: "company",
      label: "About",
      items: [
        { path: "/#why-us", label: "Why Us" },
        { path: "/#achievements", label: "Achievements" },
        { path: "/#about", label: "About Us" },
      ],
    },
  ],
  footer: [
    { path: "/store", label: "Shop" },
    { path: "/blogs", label: "Blog" },
  ],
};

// Reusable Nav Item
const NavItem = ({ item, onClose }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `hover:text-mutedSecondary relative group ${
          isActive ? "text-mutedSecondary font-medium" : ""
        }`
      }
    >
      {item.label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mutedSecondary group-hover:w-full transition-all duration-300"></span>
    </NavLink>
  </motion.div>
);

// Dropdown Component
const Dropdown = ({ items, label, isMobile, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const mobileDropdownVariants = {
    open: { opacity: 1, height: "auto", transition: { staggerChildren: 0.1 } },
    closed: { opacity: 0, height: 0 },
  };

  const itemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={toggleDropdown}
          className="w-full text-left text-xl hover:text-mutedSecondary flex items-center justify-between py-2"
        >
          {label}
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col text-sm bg-mutedSecondary/10 rounded-md overflow-hidden mt-2 ml-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileDropdownVariants}
            >
              {items.map((item, index) => (
                <motion.div key={index} variants={itemVariants} onClick={onClose}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-sm hover:bg-mutedSecondary/20 rounded-md ${
                        isActive ? "text-primary font-medium" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative dropdown">
      <button
        onClick={toggleDropdown}
        className="hover:text-mutedSecondary flex items-center gap-1 relative group"
      >
        {label}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mutedSecondary group-hover:w-full transition-all duration-300"></span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute left-0 mt-2 min-w-[200px] bg-mutedSecondary/95 backdrop-blur-sm text-gray-700 rounded-lg shadow-xl overflow-hidden z-50`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
          >
            {items.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-5 py-3 text-sm hover:bg-gray-100/50 ${
                    index < items.length - 1 ? "border-b border-gray-200/50" : ""
                  } hover:text-primary transition duration-200 ${
                    isActive ? "bg-gray-100/70" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Menu
const MobileMenu = ({ isOpen, onClose }) => {
  const menuVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-primary/95 backdrop-blur-sm text-secondary shadow-lg flex flex-col items-start px-8 py-24 space-y-6 z-40"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
        >
          {navItems.main.map((item, index) => (
            <NavItem key={`mobile-main-${index}`} item={item} onClose={onClose} />
          ))}
          {navItems.dropdowns.map((dropdown, index) => (
            <Dropdown
              key={`mobile-dropdown-${index}`}
              items={dropdown.items}
              label={dropdown.label}
              isMobile={true}
              onClose={onClose}
            />
          ))}
          {navItems.footer.map((item, index) => (
            <NavItem key={`mobile-footer-${index}`} item={item} onClose={onClose} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Navbar
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 left-0 w-full text-secondary shadow-lg py-3 px-5 flex justify-between items-center z-50 ${
        scrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 z-50">
        <motion.img
          src={logo}
          alt="Logo"
          width={100}
          height={50}
          loading="lazy"
          className="h-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 font-medium items-center relative">
        {navItems.main.map((item, index) => (
          <NavItem key={`desktop-main-${index}`} item={item} onClose={closeMenu} />
        ))}
        {navItems.dropdowns.map((dropdown, index) => (
          <Dropdown
            key={`desktop-dropdown-${index}`}
            items={dropdown.items}
            label={dropdown.label}
            onClose={closeMenu}
          />
        ))}
        {navItems.footer.map((item, index) => (
          <NavItem key={`desktop-footer-${index}`} item={item} onClose={closeMenu} />
        ))}
      </div>

      {/* Mobile Toggle */}
      <motion.button
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        className="md:hidden text-secondary text-3xl z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </motion.button>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMenu} />
    </motion.nav>
  );
};

export default Navbar;
