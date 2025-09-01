import Accordion from "../Accordion/Accordion";

const FAQ = () => {
  return (
    <section className="container mx-auto py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-dark-blue text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-dark-blue/80">
            Find answers to common questions about shopping with us
          </p>
        </div>

        <div className="space-y-4">
          <Accordion
            title="What payment methods do you accept?"
            content="We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are securely processed."
          />
          <Accordion
            title="How long does shipping take?"
            content="Standard shipping takes 3-5 business days. Express shipping options are available at checkout for faster delivery."
          />
          <Accordion
            title="What is your return policy?"
            content="We offer a 30-day return policy for most items in original condition. Some items may have specific return conditions."
          />
          <Accordion
            title="Do you ship internationally?"
            content="Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
          />
          <Accordion
            title="How can I track my order?"
            content="Once your order ships, you'll receive a confirmation email with tracking information to monitor your delivery."
          />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
