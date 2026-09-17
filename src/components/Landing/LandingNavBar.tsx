import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";
import { BookOpen, Images } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/images/logoYellow.png";

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
  utility: [
    { path: "/blogs", label: "Blog", icon: BookOpen },
    { path: "/gallery", label: "Gallery", icon: Images },
  ],
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const isCurrentPath = (path, location) => {
  const [pathname, hash] = path.split("#");
  return hash
    ? location.pathname === pathname && location.hash === `#${hash}`
    : location.pathname === pathname;
};

const NavItem = ({
  item,
  onClose,
  utility = false,
  mobile = false,
  cta = false,
}) => {
  const location = useLocation();
  const isActive = isCurrentPath(item.path, location);
  const Icon = item.icon;

  const handleClick = () => {
    const [pathname, hash] = item.path.split("#");
    onClose();

    if (hash && location.pathname === pathname && location.hash === `#${hash}`) {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Link
      to={item.path}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={`relative inline-flex min-h-10 items-center gap-1.5 rounded px-1.5 font-medium transition-colors ${focusRing} ${
        cta
          ? "justify-center bg-secondary px-4 text-primary hover:bg-white"
          : isActive
          ? "text-white after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:bg-secondary"
          : "text-secondary hover:text-white"
      } ${utility ? "text-sm font-normal" : ""} ${
        mobile ? "w-full px-0 py-1 text-lg" : ""
      }`}
    >
      {Icon && <Icon aria-hidden="true" size={16} strokeWidth={2} />}
      {item.label}
    </Link>
  );
};

const Dropdown = ({ dropdown, isMobile = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isActive = dropdown.items.some((item) =>
    isCurrentPath(item.path, location),
  );
  const panelId = `${isMobile ? "mobile" : "desktop"}-dropdown-${dropdown.key}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (!isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobile, isOpen]);

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`flex min-h-11 w-full items-center justify-between rounded py-2 text-left text-lg font-medium transition-colors ${focusRing} ${
            isActive ? "text-white" : "text-secondary hover:text-white"
          }`}
        >
          {dropdown.label}
          {isOpen ? (
            <FiChevronUp aria-hidden="true" />
          ) : (
            <FiChevronDown aria-hidden="true" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              role="group"
              aria-label={`${dropdown.label} links`}
              className="mt-2 ml-3 flex flex-col gap-1 border-l border-white/20 pl-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              {dropdown.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  onClose={onClose}
                  mobile
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`relative flex min-h-10 items-center gap-1 rounded px-1.5 font-medium transition-colors ${focusRing} ${
          isActive
            ? "text-white after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:bg-secondary"
            : "text-secondary hover:text-white"
        }`}
      >
        {dropdown.label}
        {isOpen ? (
          <FiChevronUp aria-hidden="true" />
        ) : (
          <FiChevronDown aria-hidden="true" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            role="group"
            aria-label={dropdown.label}
            className="absolute left-0 z-50 mt-2 min-w-52 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {dropdown.items.map((item) => {
              const itemIsActive = isCurrentPath(item.path, location);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  aria-current={itemIsActive ? "page" : undefined}
                  className={`block px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                    itemIsActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-primary px-5 pb-[env(safe-area-inset-bottom)] pt-5 text-secondary"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <img
              src={logo}
              alt="Zang Global"
              className="h-9 max-w-[140px] w-auto"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">Menu</span>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close navigation menu"
                onClick={onClose}
                className={`inline-flex h-10 w-10 items-center justify-center rounded text-secondary hover:text-white ${focusRing}`}
              >
                <FiX aria-hidden="true" size={25} />
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 py-6">
            {navItems.main.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                onClose={onClose}
                mobile
              />
            ))}
            {navItems.dropdowns.map((dropdown) => (
              <Dropdown
                key={dropdown.key}
                dropdown={dropdown}
                isMobile
                onClose={onClose}
              />
            ))}
            <div className="mt-4 flex gap-5 border-t border-white/15 pt-5">
              {navItems.utility.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  onClose={onClose}
                  utility
                />
              ))}
            </div>
          </div>
          <div className="border-t border-white/15 py-5">
            <NavItem
              item={{ path: "/#contact", label: "Contact us" }}
              onClose={onClose}
              mobile
              cta
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const menuWasOpen = useRef(false);
  const location = useLocation();
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (menuWasOpen.current && !mobileMenuOpen) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    menuWasOpen.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash]);

  return (
    <motion.nav
      className={`sticky top-0 z-50 flex w-full items-center justify-between px-4 py-3 shadow-md transition-all md:px-8 ${
        scrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Link
        to="/"
        aria-label="Zang Global home"
        className={`shrink-0 rounded ${focusRing}`}
      >
        <motion.img
          src={logo}
          alt=""
          width={140}
          height={48}
          className="h-9 max-w-[140px] w-auto sm:h-10"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        />
      </Link>

      <div className="hidden items-center gap-3 lg:flex">
        <div className="flex items-center gap-3 font-medium">
          {navItems.main.map((item) => (
            <NavItem key={item.path} item={item} onClose={closeMenu} />
          ))}
          {navItems.dropdowns.map((dropdown) => (
            <Dropdown
              key={dropdown.key}
              dropdown={dropdown}
              onClose={closeMenu}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 border-l border-white/20 pl-3">
          {navItems.utility.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              onClose={closeMenu}
              utility
            />
          ))}
        </div>
        <NavItem
          item={{ path: "/#contact", label: "Contact us" }}
          onClose={closeMenu}
          cta
        />
      </div>

      <motion.button
        ref={menuButtonRef}
        type="button"
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label={
          mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        className={`inline-flex h-11 w-11 items-center justify-center rounded p-2 text-3xl text-secondary hover:text-white lg:hidden ${focusRing}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mobileMenuOpen ? (
          <FiX aria-hidden="true" />
        ) : (
          <FiMenu aria-hidden="true" />
        )}
      </motion.button>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMenu} />
    </motion.nav>
  );
};

export default Navbar;
