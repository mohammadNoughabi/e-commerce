import api from "../../api/api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ShoppingCart, PackageSearch } from "lucide-react";

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

  // JSON-LD structured data
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
      <div className="flex flex-col items-center justify-center h-64 text-dark-blue gap-3">
        <PackageSearch className="w-8 h-8 animate-spin text-accent-orange" />
        <p>Loading category...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* SEO Meta */}
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

      {/* Hero Section */}
      {category && (
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-dark-blue mb-4 flex justify-center items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-accent-orange" />
            {category.title}
          </h2>
          <p
            className="text-black/70 max-w-2xl mx-auto text-lg"
            dangerouslySetInnerHTML={{ __html: category.description }}
          ></p>
        </section>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white rounded-xl shadow-sm border border-light-gray hover:shadow-md hover:border-accent-orange transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 md:h-44 overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/products/${product.title}/${product.image}`}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-dark-blue mb-1 line-clamp-1 group-hover:text-accent-orange transition-colors">
                    {product.title}
                  </h3>
                  <p
                    className="text-xs text-black/70 line-clamp-2 flex-1"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-accent-orange font-bold text-sm md:text-base">
                      ${product.price}
                    </span>
                    <span className="text-xs md:text-sm text-dark-blue underline group-hover:text-accent-orange">
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center text-dark-blue text-lg flex flex-col items-center gap-3 mt-10">
          <PackageSearch className="w-10 h-10 text-accent-orange" />
          <p>No products found in this category.</p>
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
