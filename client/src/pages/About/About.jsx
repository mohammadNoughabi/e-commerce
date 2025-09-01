import { Helmet } from "react-helmet";
import { FaWhatsapp, FaTelegramPlane, FaPhoneAlt, FaMapMarkerAlt, FaStore, FaShippingFast, FaShieldAlt, FaHeadset } from "react-icons/fa";

const About = () => {
  // JSON-LD Schema for LocalBusiness (Enhanced)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "My Store",
    "description": "Premium online store offering quality products with convenient ordering via WhatsApp, Telegram, or phone call. Fast response and reliable service.",
    "telephone": "+989124937456",
    "email": "info@mystore.com",
    "url": window.location.href,
    "sameAs": [
      "https://wa.me/989124937456",
      "https://t.me/YourTelegramUsername",
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Name",
      "addressLocality": "Your City",
      "addressCountry": "IR",
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "$$",
    "areaServed": "Worldwide",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 35.6892,
        "longitude": 51.3890
      },
      "geoRadius": "1000000"
    }
  };

  const features = [
    {
      icon: <FaShippingFast className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Safe and protected transaction methods"
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Always available to assist you"
    },
    {
      icon: <FaStore className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Diverse range of quality products"
    }
  ];

  return (
    <main className="min-h-screen bg-light-gray pt-8 pb-16 px-4 sm:px-6">
      {/* SEO Meta */}
      <Helmet>
        <title>About Us | My Store - Premium Online Shopping Experience</title>
        <meta
          name="description"
          content="Discover My Store - your trusted online shopping destination. Order via WhatsApp, Telegram, or phone call. Quality products, fast delivery, and excellent customer service."
        />
        <meta
          name="keywords"
          content="online store, shopping, ecommerce, WhatsApp order, Telegram order, phone order, quality products"
        />
        <meta property="og:title" content="About My Store - Premium Online Shopping" />
        <meta
          property="og:description"
          content="Experience premium online shopping with My Store. Order easily via WhatsApp, Telegram, or phone call."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-accent-orange/10 rounded-full mb-6">
            <FaStore className="w-10 h-10 text-accent-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-4">
            Welcome to <span className="text-accent-orange">My Store</span>
          </h1>
          <p className="text-dark-blue/70 text-lg max-w-2xl mx-auto">
            Your trusted destination for quality products and exceptional service
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-light-gray">
              <div className="inline-flex items-center justify-center p-3 bg-accent-orange/10 rounded-full mb-4 text-accent-orange">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark-blue mb-2">{feature.title}</h3>
              <p className="text-dark-blue/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12 border border-light-gray">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-dark-blue mb-6">
                How to Order
              </h2>
              <div className="space-y-4">
                <p className="text-dark-blue/80 leading-relaxed">
                  Ordering from <span className="font-semibold text-accent-orange">My Store</span> is
                  designed to be quick, easy, and convenient. Choose your preferred method to connect with us.
                </p>
                <p className="text-dark-blue/80 leading-relaxed">
                  We're committed to providing you with the best shopping experience — secure transactions,
                  fast processing, and reliable customer support. Your satisfaction is our priority.
                </p>
                <p className="text-dark-blue/80 leading-relaxed">
                  Whether you prefer messaging or a direct call, our team is ready to assist you promptly
                  and professionally.
                </p>
              </div>
            </div>
            
            <div className="bg-light-gray/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-dark-blue mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-dark-blue/80">Quality guaranteed products</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-dark-blue/80">Fast response time</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-dark-blue/80">Secure payment options</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-dark-blue/80">Reliable delivery service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-blue mb-6">
            Get in Touch
          </h2>
          <p className="text-dark-blue/70 mb-8 max-w-2xl mx-auto">
            Choose your preferred method to contact us. We're here to help you with any questions or orders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="https://wa.me/989124937456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-green-600 text-white font-semibold shadow-sm hover:shadow-md hover:bg-green-700 transition-all cursor-pointer group"
              aria-label="Contact us on WhatsApp"
            >
              <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-8 h-8" />
              </div>
              <span>WhatsApp</span>
              <span className="text-white/80 text-sm">Quick Response</span>
            </a>

            <a
              href="https://t.me/YourTelegramUsername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-dark-blue text-white font-semibold shadow-sm hover:shadow-md hover:bg-dark-blue/90 transition-all cursor-pointer group"
              aria-label="Contact us on Telegram"
            >
              <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                <FaTelegramPlane className="w-8 h-8" />
              </div>
              <span>Telegram</span>
              <span className="text-white/80 text-sm">Instant Messaging</span>
            </a>

            <a
              href="tel:+989124937456"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-accent-orange text-dark-blue font-semibold shadow-sm hover:shadow-md hover:bg-accent-orange/90 transition-all cursor-pointer group"
              aria-label="Call us directly"
            >
              <div className="p-3 bg-dark-blue/10 rounded-full group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="w-8 h-8" />
              </div>
              <span>Call Us</span>
              <span className="text-dark-blue/80 text-sm">Direct Support</span>
            </a>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-light-gray">
          <div className="p-6 border-b border-light-gray">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="w-6 h-6 text-accent-orange" />
              <h2 className="text-xl font-semibold text-dark-blue">Our Location</h2>
            </div>
            <p className="text-dark-blue/70 mt-2">Visit us or see where we're located</p>
          </div>
          <iframe
            title="My Store Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.027560207085!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0132f87b!2sTehran!5e0!3m2!1sen!2sir!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[400px]"
          ></iframe>
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8 border border-light-gray">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-dark-blue mb-2">Business Hours</h3>
              <p className="text-dark-blue/70">Monday - Sunday</p>
              <p className="text-dark-blue/70">9:00 AM - 9:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-blue mb-2">Contact Info</h3>
              <p className="text-dark-blue/70">+98 912 493 7456</p>
              <p className="text-dark-blue/70">info@mystore.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-blue mb-2">Service Areas</h3>
              <p className="text-dark-blue/70">Nationwide Delivery</p>
              <p className="text-dark-blue/70">International Shipping</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;