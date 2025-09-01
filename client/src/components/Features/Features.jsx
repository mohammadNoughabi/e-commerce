import FeatureCard from "../FeatureCard/FeatureCard";

const Features = () => {
  return (
    <section className="bg-light-gray py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-dark-blue text-3xl font-bold mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-dark-blue/80 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience for our
            customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="🚚"
            title="Fast Delivery"
            description="Get your orders delivered quickly with our efficient shipping partners."
          />
          <FeatureCard
            icon="🔒"
            title="Secure Payments"
            description="Your transactions are protected with industry-leading security measures."
          />
          <FeatureCard
            icon="🔄"
            title="Easy Returns"
            description="Not satisfied? Return within 30 days for a full refund, no questions asked."
          />
          <FeatureCard
            icon="⭐"
            title="Quality Guarantee"
            description="We carefully curate all products to ensure the highest quality standards."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
