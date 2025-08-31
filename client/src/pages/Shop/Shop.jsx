import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Shop = () => {
  const categories = useSelector((state) => state.category?.categories || []);
  const products = useSelector((state) => state.product?.products || []);
  const apiBase = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

  // Group products by category
  const productsByCategory = {};
  categories.forEach((category) => {
    productsByCategory[category._id] = products.filter(
      (product) => product.categoryId === category._id
    );
  });

  // JSON-LD Structured Data
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
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-accent-orange rounded-full shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue tracking-tight">
              Shop Categories
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of products across various categories. 
            Find exactly what you're looking for with ease.
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
          <div className="space-y-16">
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-dark-blue mb-2">
                      {cat.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate(`/category/${cat._id}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-accent-orange text-white rounded-full hover:bg-dark-blue transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Products Slider */}
                {productsByCategory[cat._id]?.length > 0 ? (
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={true}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                        bulletClass: 'swiper-pagination-bullet',
                        bulletActiveClass: 'swiper-pagination-bullet-active bg-accent-orange',
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                      }}
                      breakpoints={{
                        480: {
                          slidesPerView: 1,
                        },
                        640: {
                          slidesPerView: 2,
                        },
                        768: {
                          slidesPerView: 3,
                        },
                        1024: {
                          slidesPerView: 4,
                        },
                        1280: {
                          slidesPerView: 5,
                        },
                      }}
                      className="pb-12"
                    >
                      {productsByCategory[cat._id].map((product) => (
                        <SwiperSlide key={product._id}>
                          <div
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-accent-orange/20"
                            onClick={() => navigate(`/product/${product._id}`)}
                          >
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={`${apiBase}/uploads/products/${
                                  product.title
                                }/${product.image || "default.jpg"}`}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                            </div>
                            <div className="p-5">
                              <h3 className="font-semibold text-dark-blue text-lg mb-2 line-clamp-2 group-hover:text-accent-orange transition-colors duration-200">
                                {product.title}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-accent-orange">
                                  ${product.price}
                                </span>
                                {product.stock > 0 ? (
                                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    In Stock
                                  </span>
                                ) : (
                                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Custom Navigation */}
                    <div className="swiper-button-prev !text-accent-orange !w-12 !h-12 !bg-white !rounded-full !shadow-lg hover:!bg-dark-blue hover:!text-white transition-all duration-200 after:!text-xl"></div>
                    <div className="swiper-button-next !text-accent-orange !w-12 !h-12 !bg-white !rounded-full !shadow-lg hover:!bg-dark-blue hover:!text-white transition-all duration-200 after:!text-xl"></div>
                    
                    {/* Custom Pagination */}
                    <div className="swiper-pagination !bottom-0"></div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No products available in this category yet.
                    </p>
                    <button
                      onClick={() => navigate(`/category/${cat._id}`)}
                      className="mt-4 px-6 py-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors duration-200"
                    >
                      Check Back Later
                    </button>
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