import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "../../components/Slider/Slider";
import Features from "../../components/Features/Features";
import FAQ from "../../components/FAQ/FAQ";

const Home = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products) || [];
  const categories = useSelector((state) => state.category.categories) || [];
  const latestProducts = products.slice(-8).reverse();

  return (
    <div className="flex flex-col space-y-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px] flex items-center justify-center text-center bg-dark-blue">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-blue/70 to-dark-blue/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-accent-orange bg-accent-orange/10 rounded-full mb-4 border border-accent-orange/20">
              Welcome to our store
            </span>
          </div>

          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Amazing <br className="hidden sm:block" />
            <span className="text-accent-orange">Products</span>
          </h1>

          <p className="text-light-gray text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Quality, variety, and unbeatable prices all in one place. Shop the
            latest trends with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-4 bg-accent-orange cursor-pointer text-dark-blue rounded-xl font-semibold text-base hover:bg-accent-orange/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Latest Products Slider */}
      {latestProducts.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-dark-blue text-3xl font-bold mb-4">
              New Arrivals
            </h2>
            <p className="text-dark-blue/80 max-w-2xl mx-auto">
              Discover our latest products and find your next favorite item
            </p>
          </div>
          <Slider items={latestProducts} />
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center cursor-pointer text-accent-orange font-medium hover:text-accent-orange/80 transition-colors"
            >
              View all products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* Features Section */}
      <Features />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-dark-blue text-3xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-dark-blue/80 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you
              need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/category/${category._id}`)}
                className="cursor-pointer group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/categories/${category.title}/${category.image}`}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-dark-blue group-hover:text-accent-orange transition-colors">
                    {category.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Home;
