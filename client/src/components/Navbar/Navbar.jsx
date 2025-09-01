import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let { isAuthenticated, userRole } = useSelector((state) => state.auth);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  let navLinks = [
    { text: "Home", path: "/", icon: "🏠" },
    { text: "Shop", path: "/shop", icon: "🛒" },
    { text: "About", path: "/about", icon: "ℹ️" },
    !isAuthenticated && { text: "Login", path: "/auth", icon: "🔐" },
    isAuthenticated && { text: "Profile", path: "/profile", icon: "👤" },
    isAuthenticated &&
      userRole === "admin" && {
        text: "Dashboard",
        path: "/dashboard",
        icon: "📊",
      },
  ].filter(Boolean);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full transition-all duration-300 z-50 ${
          isScrolled ? "bg-dark-blue shadow-sm py-2" : "bg-dark-blue py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-white cursor-pointer flex items-center"
              >
                E-Commerce
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex cursor-pointer items-center ${
                    activeLink === link.path
                      ? "text-dark-blue bg-accent-orange font-semibold"
                      : "text-white hover:text-accent-orange hover:bg-light-gray"
                  }`}
                >
                  <span className="mr-2 text-sm">{link.icon}</span>
                  {link.text}
                </button>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Mobile menu button and search */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="md:hidden">
                <SearchBar isMobile={true} />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-light-gray transition-colors duration-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen
                        ? "rotate-45 translate-y-1.5"
                        : "-translate-y-1"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                      isMenuOpen ? "opacity-0" : "opacity-100 mt-1"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen
                        ? "-rotate-45 -translate-y-1.5"
                        : "translate-y-1 mt-1"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? "opacity-40" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel */}
        <div className="absolute top-0 right-0 h-full w-80 bg-dark-blue shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-gray">
              <span className="text-xl font-semibold text-white">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg text-white hover:bg-light-gray transition-colors duration-200"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* SearchBar */}
            <div className="px-6 py-5 border-b border-light-gray">
              <SearchBar isExpanded={true} />
            </div>

            {/* Links */}
            <div className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
                    activeLink === link.path
                      ? "text-dark-blue bg-accent-orange font-semibold"
                      : "text-white hover:text-accent-orange hover:bg-light-gray"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen
                      ? "translateX(0)"
                      : "translateX(20px)",
                  }}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.text}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-light-gray bg-dark-blue">
              <div className="text-center text-light-gray text-sm">
                © {new Date().getFullYear()} SwiftCart. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className={`h-20 ${isScrolled ? "h-16" : "h-20"}`}></div>
    </>
  );
};

export default Navbar;
