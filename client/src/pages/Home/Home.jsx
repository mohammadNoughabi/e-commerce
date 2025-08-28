import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "../../components/Slider/Slider";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products) || [];
  const latestProducts = products.slice(-6).reverse();

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 flex flex-col items-center">
      <div className="text-accent-orange text-4xl sm:text-5xl mb-4">{icon}</div>
      <h3 className="text-dark-blue font-semibold text-lg sm:text-xl mb-2">
        {title}
      </h3>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </div>
  );

  const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border border-light-gray rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 sm:px-4 py-3 bg-light-gray text-dark-blue font-semibold text-left flex justify-between items-center hover:bg-gray-200 transition-colors"
        >
          {title}
          <span
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-40 px-3 sm:px-4 py-3" : "max-h-0"
          } bg-white text-gray-700`}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-16 overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1920x800/?shopping,ecommerce')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Amazing Products
          </h1>
          <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Quality, variety, and unbeatable prices all in one place.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-accent-orange text-dark-blue px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 rounded-lg font-semibold text-base sm:text-lg md:text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Latest Products Slider */}
      {latestProducts.length > 0 && (
        <section className="container mx-auto">
          <h2 className="text-dark-blue text-2xl sm:text-3xl font-bold mb-8 text-center">
            Latest Arrivals
          </h2>
          <Slider items={latestProducts} />
        </section>
      )}

      {/* Features Section */}
      <section className="bg-light-gray py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-dark-blue text-2xl sm:text-3xl font-bold mb-10 text-center">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon="⚡"
              title="Fast Delivery"
              description="Get your orders delivered in record time with our efficient logistics."
            />
            <FeatureCard
              icon="🔒"
              title="Secure Payments"
              description="Shop with confidence using our safe and reliable payment gateways."
            />
            <FeatureCard
              icon="🛍️"
              title="Wide Selection"
              description="Choose from thousands of products across various categories."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-12 sm:py-16">
        <h2 className="text-dark-blue text-2xl sm:text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <Accordion
            title="What payment methods do you accept?"
            content="We accept major credit cards, PayPal, and bank transfers."
          />
          <Accordion
            title="How long does shipping take?"
            content="Standard shipping takes 3-5 business days, while express shipping is available."
          />
          <Accordion
            title="What is your return policy?"
            content="We offer a 30-day return policy for most items. See our returns page for details."
          />
          <Accordion
            title="Do you ship internationally?"
            content="Yes, we ship worldwide to over 100 countries."
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
