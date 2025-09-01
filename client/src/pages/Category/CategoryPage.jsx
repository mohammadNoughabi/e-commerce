import api from "../../api/api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ShoppingCart, PackageSearch, ArrowRight, Home, Star, ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/api/category/${id}`);
      setCategory(response.data.category);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category?.title || "Category",
    description: category?.description || "Explore products in this category.",
    hasPart: products.map((product) => ({
      "@type": "Product",
      name: product.title,
      image: `${apiBase}/uploads/products/${product.title}/${product.image}`,
      description: product.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `/product/${product._id}`,
      },
    })),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-dark-blue gap-4">
        <div className="relative">
          <PackageSearch className="w-12 h-12 text-accent-orange animate-pulse" />
          <div className="absolute inset-0 border-4 border-t-accent-orange/30 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-600">Loading category...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{category ? `${category.title} | My Store` : "Category"}</title>
        <meta
          name="description"
          content={
            category?.description ||
            "Browse a wide range of products in this category."
          }
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
        <div className="flex items-center space-x-1 text-gray-500">
          <Link 
            to="/" 
            className="flex items-center hover:text-accent-orange transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link
            to="/shop"
            className="hover:text-accent-orange transition-colors duration-200"
          >
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-medium text-dark-blue truncate max-w-xs md:max-w-md">
            {category?.title || "Category"}
          </span>
        </div>
      </nav>

      {/* Category Hero Section */}
      {category && (
        <section className="relative mb-12 rounded-2xl overflow-hidden shadow-md animate-fadeIn bg-gradient-to-r from-blue-50 to-orange-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="flex-1 text-center md:text-left mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-blue mb-4 flex justify-center md:justify-start items-center gap-3">
                <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-accent-orange" />
                {category.title}
              </h1>
              <p
                className="max-w-3xl mx-auto md:mx-0 text-gray-700 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: category.description }}
              ></p>
            </div>
            <div className="flex-1">
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={`${apiBase}/uploads/categories/${category.title}/${category.image}`}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-blue">
              Products <span className="text-accent-orange">({products.length})</span>
            </h2>
            <div className="text-sm text-gray-500">
              Showing all products
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
              >
                <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={`${apiBase}/uploads/products/${product.title}/${product.image}`}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-accent-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                      New
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-dark-blue mb-2 line-clamp-1 group-hover:text-accent-orange transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(24)</span>
                    </div>
                    <p
                      className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    ></p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-accent-orange font-bold text-xl">
                        ${product.price}
                      </span>
                      <span className="text-sm text-dark-blue font-medium flex items-center group-hover:text-accent-orange group-hover:translate-x-1 transition-all">
                        View details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                <button className="mt-2 mx-4 mb-4 bg-dark-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-orange transition-colors duration-200 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center text-dark-blue my-16 py-12 animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-5">
              <PackageSearch className="w-8 h-8 text-accent-orange" />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              No products found in this category
            </p>
            <p className="text-gray-500 mb-6">
              Try exploring other categories for more options.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center text-accent-orange font-medium hover:text-dark-blue transition-colors"
            >
              Browse all categories
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default CategoryPage;