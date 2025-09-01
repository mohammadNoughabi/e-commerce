import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Truck,
  ArrowRight,
} from "lucide-react";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Shop", path: "/shop" },
    { text: "About Us", path: "/about" },
    !isAuthenticated && { text: "Login / Register", path: "/auth" },
    isAuthenticated && { text: "Profile", path: "/profile" },
    isAuthenticated &&
      userRole === "admin" && { text: "Dashboard", path: "/dashboard" },
  ].filter(Boolean);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "E-Commerce",
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-234-567-890",
      contactType: "customer service",
      email: "support@ecommerce.com",
      areaServed: "US",
      availableLanguage: "English",
    },
    sameAs: [
      "https://wa.me/989124937456",
      "https://t.me/yourtelegramid",
      "https://instagram.com/ecommerce",
      "https://twitter.com/ecommerce",
    ],
  };

  const features = [
    { icon: <Truck className="w-5 h-5" />, text: "Free Shipping Over $50" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payment" },
    { icon: <Heart className="w-5 h-5" />, text: "Satisfaction Guarantee" },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>


      {/* Main Footer */}
      <footer
        className="bg-dark-blue text-white relative z-10"
        role="contentinfo"
        itemScope
        itemType="https://schema.org/WPFooter"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand + About */}
            <section aria-labelledby="footer-brand" className="lg:col-span-2">
              <h2
                id="footer-brand"
                onClick={() => navigate("/")}
                className="text-accent-orange font-bold text-2xl cursor-pointer hover:opacity-90 transition mb-4"
                itemProp="name"
              >
                E-Commerce
              </h2>
              <p
                className="text-light-gray text-sm leading-relaxed max-w-sm mb-6"
                itemProp="description"
              >
                Discover top-quality products and enjoy a seamless shopping
                experience with fast delivery, secure payments, and trusted
                customer service.
              </p>
            </section>

            {/* Quick Links */}
            <nav aria-labelledby="footer-navigation">
              <h2
                id="footer-navigation"
                className="text-white font-semibold text-lg mb-5"
              >
                Quick Links
              </h2>
              <ul className="space-y-3">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-light-gray cursor-pointer hover:text-accent-orange text-sm font-medium transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact Info */}
            <address aria-labelledby="footer-contact" className="not-italic">
              <h2
                id="footer-contact"
                className="text-white font-semibold text-lg mb-5"
              >
                Contact Info
              </h2>
              <ul className="space-y-4 text-light-gray text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:support@ecommerce.com"
                    className="hover:text-accent-orange transition-colors duration-300"
                    title="Email Support"
                    itemProp="email"
                  >
                    support@ecommerce.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-accent-orange transition-colors duration-300"
                    title="Call Support"
                    itemProp="telephone"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
                  <span
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <span itemProp="streetAddress">123 Shopping St</span>,{" "}
                    <span itemProp="addressLocality">Commerce City</span>,{" "}
                    <span itemProp="addressCountry">USA</span>
                  </span>
                </li>
              </ul>
            </address>

            {/* Social Links */}
            <section aria-labelledby="footer-social">
              <h2
                id="footer-social"
                className="text-white font-semibold text-lg mb-5"
              >
                Follow Us
              </h2>
              <div className="grid  grid-cols-1 gap-3 mb-2">
                <a
                  href="https://wa.me/989124937456"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="Chat with us on WhatsApp"
                  className="flex w-fit items-center gap-2 px-3 py-3 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-sm font-medium cursor-pointer"
                >
                  <FaWhatsapp className="h-4 w-4" />
                </a>
                <a
                  href="https://t.me/yourtelegramid"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message on Telegram"
                  title="Message us on Telegram"
                  className="flex w-fit items-center gap-2 px-3 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-sm font-medium cursor-pointer"
                >
                  <FaTelegramPlane className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/ecommerce"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  title="Follow us on Instagram"
                  className="flex w-fit rounded-full items-center gap-2 px-3 py-3 bg-pink-600 hover:bg-pink-700 transition-all duration-300 text-sm font-medium cursor-pointer"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a
                  href="tel:+1234567890"
                  aria-label="Call us directly"
                  title="Call us directly"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-orange hover:bg-accent-orange/90 transition-all duration-300 shadow-md cursor-pointer"
                >
                  <FaPhoneAlt className="h-4 w-4 text-dark-blue" />
                </a>
              </div>
            </section>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-light-gray/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light-gray text-sm text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold">E-Commerce</span>. All rights
              reserved.
            </p>

            <div className="flex items-center gap-6 text-light-gray text-sm">
              <a
                href="/privacy-policy"
                className="hover:text-accent-orange transition-colors duration-300"
                itemProp="url"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-accent-orange transition-colors duration-300"
                itemProp="url"
              >
                Terms of Service
              </a>
              <a
                href="/sitemap.xml"
                className="hover:text-accent-orange transition-colors duration-300"
                itemProp="url"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
