import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  // Navigation links
  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Shop", path: "/shop" },
    { text: "About", path: "/about" },
    !isAuthenticated && { text: "Auth", path: "/auth" },
    isAuthenticated && { text: "Profile", path: "/profile" },
    isAuthenticated &&
      userRole === "admin" && { text: "Dashboard", path: "/dashboard" },
  ].filter(Boolean);

  return (
    <footer
      className="bg-dark-blue text-white relative z-10"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + Description */}
          <div className="space-y-4">
            <h3
              onClick={() => navigate("/")}
              className="text-accent-orange font-bold text-2xl cursor-pointer"
            >
              E-Commerce
            </h3>
            <p className="text-light-gray text-sm leading-relaxed max-w-xs">
              Your one-stop shop for quality products. Explore our wide range of
              items and enjoy a seamless shopping experience.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer Navigation">
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-light-gray hover:text-accent-orange text-sm font-medium transition-all duration-300 hover:translate-x-2 block"
                  >
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic">
            <h3 className="text-white font-semibold text-lg mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-light-gray text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-orange" />
                <a
                  href="mailto:support@ecommerce.com"
                  className="hover:text-accent-orange transition-colors duration-300"
                  title="Email us"
                >
                  support@ecommerce.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-orange" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-accent-orange transition-colors duration-300"
                  title="Call us"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-orange" />
                <span>123 Shopping St, Commerce City, USA</span>
              </li>
            </ul>

            {/* Social Buttons */}
            <div className="mt-6 flex gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/989124937456"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                title="Chat with us on WhatsApp"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-md"
              >
                <FaWhatsapp className="h-5 w-5 text-white" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/yourtelegramid"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on Telegram"
                title="Message us on Telegram"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-md"
              >
                <FaTelegramPlane className="h-5 w-5 text-white" />
              </a>

              {/* Direct Call */}
              <a
                href="tel:+1234567890"
                aria-label="Call us directly"
                title="Call us directly"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-orange hover:bg-orange-600 transition-all duration-300 shadow-md"
              >
                <FaPhoneAlt className="h-5 w-5 text-dark-blue" />
              </a>
            </div>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-light-gray text-center text-light-gray text-sm">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
