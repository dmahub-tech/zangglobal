import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/images/logoYellow.png";
import { X } from "lucide-react";

// Navigation structure
const navItems = {
  main: [{ path: "/#welcome", label: "Home" }],
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
const NavItem = ({ item, onClose }) => {
  
  const location = useLocation()
  const pathname = location.pathname
  console.log(pathname)
  return(
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <a
      href={item.path}
      onClick={onClose}
      className={
        `relative group transition-colors ${
          pathname == item.path
            ? "text-primary font-medium"
            : "text-secondary hover:text-mutedSecondary"
        }`
      }
    >
      {item.label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mutedSecondary group-hover:w-full transition-all duration-300"></span>
    </a>
  </motion.div>
)};

// Reusable Dropdown
const Dropdown = ({ items, label, isMobile, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  const mobileDropdownVariants = {
    open: { opacity: 1, height: "auto", transition: { staggerChildren: 0.05 } },
    closed: { opacity: 0, height: 0, overflow: "hidden" },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={toggleDropdown}
          className="w-full text-left text-lg flex items-center justify-between py-2 text-secondary hover:text-mutedSecondary"
        >
          {label} {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col bg-white/10 rounded-md mt-2 ml-4 backdrop-blur-sm overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileDropdownVariants}
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="px-4 py-2"
                >
                  <a
                    href={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block text-sm rounded-md ${
                        isActive
                          ? "text-primary font-medium"
                          : "text-secondary hover:text-mutedSecondary"
                      }`
                    }
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-secondary hover:text-mutedSecondary group relative"
      >
        {label}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mutedSecondary group-hover:w-full transition-all duration-300"></span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 mt-2 min-w-[200px] bg-white shadow-md rounded-md overflow-hidden z-50"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
          >
            {items.map((item, index) => (
              <a
                key={index}
                href={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-medium bg-gray-100"
                      : "text-secondary hover:bg-gray-50 hover:text-mutedSecondary"
                  } ${index < items.length - 1 ? "border-b border-gray-200" : ""}`
                }
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Slide Menu
const MobileMenu = ({ isOpen, setIsOpen, onClose }) => {
  const menuVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-0 left-0 w-full h-screen bg-primary/95 text-secondary px-6 py-20 z-50 flex flex-col space-y-5"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <button onClick={()=>setIsOpen(!isOpen)}>
            <X />
          </button>
          {navItems.main.map((item, index) => (
            <NavItem key={`mobile-main-${index}`} item={item} onClose={onClose} />
          ))}
          {navItems.dropdowns.map((dropdown, index) => (
            <Dropdown
              key={`mobile-dropdown-${index}`}
              items={dropdown.items}
              label={dropdown.label}
              isMobile
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

// Navbar Component
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 left-0 z-50 w-full py-3 px-4 md:px-8 flex items-center justify-between shadow-md transition-all ${
        scrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Logo */}
      <Link to="/" className="z-50">
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

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 items-center font-medium">
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

      {/* Mobile Menu Button */}
      <motion.button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="md:hidden text-3xl z-50 text-secondary"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </motion.button>

      {/* Mobile Menu Panel */}
      <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} onClose={closeMenu} />
    </motion.nav>
  );
};
export default Navbar;
