import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, ShoppingBag, Home } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Shop = () => {
  let categories = useSelector((state) => state.category?.categories || []);
  const products = useSelector((state) => state.product?.products || []);
  const apiBase = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const location = useLocation();

  // Group products by category
  const productsByCategory = {};
  categories.forEach((category) => {
    productsByCategory[category._id] = products.filter(
      (product) => product.categoryId === category._id
    );
  });

  categories = categories.filter(
    (category) => productsByCategory[category._id]?.length > 0
  );

  // JSON-LD Structured Data for Categories & Products
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop Categories",
    description:
      "Browse our shop categories including electronics, fashion, and more.",
    hasPart: categories?.map((cat) => ({
      "@type": "Collection",
      name: cat.title,
      description: cat.description,
      url: `/category/${cat._id}`,
      image: `${apiBase}/uploads/categories/${cat.title}/${cat.image}`,
      hasPart: productsByCategory[cat._id]?.map((product) => ({
        "@type": "Product",
        name: product.title,
        image: `${apiBase}/uploads/products/${product.title}/${product.image}`,
        description: product.description || `${product.title} product`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability:
            product.stock > 0
              ? "http://schema.org/InStock"
              : "http://schema.org/OutOfStock",
        },
      })),
    })),
  };

  return (
    <main className="min-h-screen bg-light-gray pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      {/* SEO Meta */}
      <Helmet>
        <title>Shop Categories | My Store</title>
        <meta
          name="description"
          content="Browse our shop categories including electronics, fashion, accessories, and more. Discover products tailored to your needs."
        />
        <link rel="canonical" href={`https://mystore.com${location.pathname}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="flex items-center gap-1 hover:text-gray-900">
            <Home className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Shop</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-accent-orange rounded-full shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue tracking-tight">
              Explore Our Products
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of products across various
            categories. Find exactly what you're looking for with ease.
          </p>
        </div>

        {/* Loading / Empty states */}
        {!categories ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No categories available at the moment.
            </p>
          </div>
        ) : (
          /* Categories with Product Sliders */
          <div className="space-y-12">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                      {cat.title}
                    </h2>
                    <p className="text-gray-500 text-sm lg:text-base max-w-2xl">
                      Discover our curated collection of {cat.title.toLowerCase()} products
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/category/${cat._id}`)}
                    className="flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm font-medium text-sm whitespace-nowrap"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Products Slider */}
                {productsByCategory[cat._id]?.length > 0 && (
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      loop={true}
                      autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{
                        clickable: true,
                        el: ".swiper-pagination",
                        bulletClass: "swiper-pagination-bullet !bg-gray-300",
                        bulletActiveClass:
                          "swiper-pagination-bullet-active !bg-gray-700",
                      }}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }}
                      breakpoints={{
                        480: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                      }}
                      className="pb-10"
                    >
                      {productsByCategory[cat._id].map((product) => (
                        <SwiperSlide key={product._id}>
                          <div
                            className="group bg-white mb-3 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
                            onClick={() => navigate(`/product/${product._id}`)}
                          >
                            <div className="relative h-56 overflow-hidden bg-gray-50">
                              <img
                                src={`${apiBase}/uploads/products/${
                                  product.title
                                }/${product.image || "default.jpg"}`}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute top-3 right-3">
                                {product.stock > 0 ? (
                                  <span className="text-xs bg-white text-green-700 px-2 py-1.5 rounded-full shadow-sm font-medium">
                                    In Stock
                                  </span>
                                ) : (
                                  <span className="text-xs bg-white text-red-700 px-2 py-1.5 rounded-full shadow-sm font-medium">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                {product.title}
                              </h3>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xl font-semibold text-gray-900">
                                  ${product.price}
                                </span>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-gray-900 hover:bg-gray-800 p-2 rounded-full shadow-sm">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <div className="swiper-button-prev !text-gray-700 !w-10 !h-10 !bg-white !rounded-full !shadow-sm hover:!bg-gray-50 hover:!shadow-md transition-all duration-200 after:!text-sm"></div>
                    <div className="swiper-button-next !text-gray-700 !w-10 !h-10 !bg-white !rounded-full !shadow-sm hover:!bg-gray-50 hover:!shadow-md transition-all duration-200 after:!text-sm"></div>

                    {/* Custom Pagination */}
                    <div className="swiper-pagination !bottom-0"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
