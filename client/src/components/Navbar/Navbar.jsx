import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  let { isAuthenticated, userRole } = useSelector((state) => state.auth);

  let navLinks = [
    { text: "Home", path: "/" },
    { text: "Shop", path: "/product" },
    { text: "Blog", path: "/blog" },
    { text: "About", path: "/about" },
    !isAuthenticated && { text: "Auth", path: "/auth" },
    isAuthenticated && { text: "Profile", path: "/profile" },
    isAuthenticated &&
      userRole === "admin" && { text: "Dashboard", path: "/dashboard" },
  ].filter(Boolean); // remove false/null entries

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-slate-900 shadow-lg relative z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span
                onClick={() => navigate("/")}
                className="text-white font-bold text-xl hover:text-orange-400 transition-colors duration-300 cursor-pointer"
              >
                E-Commerce
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleLinkClick(link.path);
                      navigate(link.path);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      activeLink === link.path
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                        : "text-gray-300 hover:bg-slate-800 hover:text-white hover:shadow-md"
                    }`}
                  >
                    {link.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className={`h-6 w-6 transition-transform duration-300 ${
                    isMenuOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full max-w-full w-64 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <span className="text-white font-bold text-lg">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors duration-200 transform hover:scale-110"
            >
              <svg
                className="h-6 w-6"
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

          {/* Mobile menu items */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  handleLinkClick(link.path);
                  navigate(link.path);
                }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeLink === link.path
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white hover:translate-x-2"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                  transform: isMenuOpen
                    ? `translateX(0) translateY(0)`
                    : `translateX(30px) translateY(-10px)`,
                  opacity: isMenuOpen ? 1 : 0,
                }}
              >
                {link.text}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="text-center text-gray-400 text-sm">
              © 2024 E-Commerce
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
