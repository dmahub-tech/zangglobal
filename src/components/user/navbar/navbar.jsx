import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/images/logoBlue.png";
import { fetchUser, logout } from "../../../redux/slice/authSlice";
import { fetchCart } from "../../../redux/slice/cartSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const profileRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.items?.productsInCart) || [];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user data when logged in
  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token]);

  // Fetch cart when user changes
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchCart(user.userId));
    }
  }, [user?.userId]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const isActive = (path) => location.pathname === path;

  // Animation variants
  const menuVariants = {
    closed: { x: "-100%" },
    open: { x: 0 }
  };

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 }
    })
  };

  const navLinks = [
    { path: "/store", name: "Home" },
    { path: "/contact", name: "Contact" }
  ];

  const categories = [
    { name: "Cables", path: "/fashion" },
    { name: "Powerbanks", path: "/gift-boxes" },
    { name: "Solar Lanterns", path: "/books" },
    { name: "Chargers", path: "/stationery" },
    { name: "All Products", path: "/shop" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 md:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 mx-1 rounded-md text-sm lg:text-base font-medium ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/search"
              className="p-2 text-gray-700 hover:text-primary transition rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary transition rounded-full hover:bg-gray-100"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileMenu}
                className="p-2 text-gray-700 hover:text-primary transition rounded-full hover:bg-gray-100 flex items-center"
                aria-label="User profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {user?.name && (
                  <span className="ml-1 hidden sm:inline text-sm">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                  >
                    {user ? (
                      <>
                        <Link
                          to="/orders"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black z-40"
            />
            
            {/* Menu Content */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-64 z-50 bg-white shadow-xl"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Link to="/" onClick={toggleMenu}>
                  <img src={logo} alt="Logo" className="h-8" />
                </Link>
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="py-4">
                {navLinks.map(({ path, name }, i) => (
                  <motion.div
                    key={path}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      to={path}
                      onClick={toggleMenu}
                      className={`block px-6 py-3 ${
                        isActive(path)
                          ? "text-primary bg-primary/10"
                          : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      {name}
                    </Link>
                  </motion.div>
                ))}

                <div className="px-6 py-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        onClick={toggleMenu}
                        className="block py-1.5 text-sm text-gray-700 hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t px-6 py-4">
                {user ? (
                  <>
                    <Link
                      to="/orders"
                      onClick={toggleMenu}
                      className="block py-2 text-sm text-gray-700 hover:text-primary"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        toggleMenu();
                        handleLogout();
                      }}
                      className="block py-2 text-sm text-gray-700 hover:text-primary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block py-2 text-sm text-gray-700 hover:text-primary"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={toggleMenu}
                      className="block py-2 text-sm text-gray-700 hover:text-primary"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;