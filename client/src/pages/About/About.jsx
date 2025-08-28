import { Helmet } from "react-helmet";
import { FaWhatsapp, FaTelegramPlane, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const About = () => {
  // JSON-LD Schema for LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "My Store",
    description:
      "Order easily via WhatsApp, Telegram, or phone call. Fast response and reliable service.",
    telephone: "+989124937456",
    sameAs: [
      "https://wa.me/989124937456",
      "https://t.me/YourTelegramUsername",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Name",
      addressLocality: "Your City",
      addressCountry: "IR",
    },
  };

  return (
    <main className="min-h-screen bg-light-gray pt-12 pb-16 px-6">
      {/* SEO Meta */}
      <Helmet>
        <title>About Us | My Store</title>
        <meta
          name="description"
          content="Learn more about My Store. Order via WhatsApp, Telegram, or phone call. Find us easily with our location map."
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <FaMapMarkerAlt className="w-8 h-8 text-accent-orange" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-dark-blue tracking-wide">
            About Us
          </h1>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-dark-blue mb-4">
            How to Order
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Ordering from <span className="font-semibold">My Store</span> is
            quick and easy. You can place your order through WhatsApp, Telegram,
            or simply give us a phone call. Our team will respond promptly to
            confirm your order and provide all the details you need.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We’re committed to offering you the best shopping experience —
            secure, fast, and reliable. Feel free to reach out through your
            preferred communication channel.
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <a
            href="https://wa.me/989124937456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-4 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp className="w-6 h-6" /> WhatsApp
          </a>

          <a
            href="https://t.me/YourTelegramUsername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-4 rounded-xl bg-dark-blue text-white font-semibold shadow-md hover:bg-accent-orange hover:text-dark-blue transition"
            aria-label="Contact us on Telegram"
          >
            <FaTelegramPlane className="w-6 h-6" /> Telegram
          </a>

          <a
            href="tel:+989124937456"
            className="flex items-center justify-center gap-3 py-4 rounded-xl bg-accent-orange text-dark-blue font-semibold shadow-md hover:bg-dark-blue hover:text-white transition"
            aria-label="Call us"
          >
            <FaPhoneAlt className="w-6 h-6" /> Call Us
          </a>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.027560207085!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0132f87b!2sTehran!5e0!3m2!1sen!2sir!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="w-full h-[400px]"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default About;
