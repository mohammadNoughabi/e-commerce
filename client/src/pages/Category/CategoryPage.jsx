import api from "../../api/api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ShoppingCart, PackageSearch, Home } from "lucide-react";
import Shop from "../Shop/Shop";

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
      <div className="flex flex-col items-center justify-center h-72 text-dark-blue gap-4 animate-fadeIn">
        <PackageSearch className="w-10 h-10 animate-spin text-accent-orange" />
        <p className="text-lg font-medium">Loading category...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
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
      <nav className="text-sm mb-8" aria-label="Breadcrumb">
        <div className="flex items-center space-x-2 text-dark-blue/70">
          <Link to="/" className="hover:text-accent-orange transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/shop"
            className="hover:text-accent-orange transition-colors"
          >
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/category/${category?._id}`}
            className="hover:text-accent-orange transition-colors"
          >
            {category?.title || "Category"}
          </Link>
        </div>
      </nav>

      {category && (
        <section className="text-center mb-12">
          <div className="bg-gradient-to-r from-dark-blue/90 to-accent-orange/80 rounded-2xl p-8 shadow-md animate-fadeIn">
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-3 flex justify-center items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-black drop-shadow-md" />
              {category.title}
            </h2>
            <p
              className="text-black/90 mx-auto text-md lg:text-justify mt-5"
              dangerouslySetInnerHTML={{ __html: category.description }}
            ></p>
          </div>
        </section>
      )}

      {products.length > 0 ? (
        <section>
          <h2 className=" mb-6 text-4xl font-bold">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white rounded-2xl shadow-sm border border-light-gray hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/products/${product.title}/${product.image}`}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-dark-blue mb-1 line-clamp-1 group-hover:text-accent-orange transition-colors">
                    {product.title}
                  </h3>
                  <p
                    className="text-sm text-black/70 line-clamp-2 flex-1"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-accent-orange font-bold text-base">
                      ${product.price}
                    </span>
                    <span className="text-sm text-dark-blue underline group-hover:text-accent-orange">
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center text-dark-blue mt-16 animate-fadeIn">
          <div className="bg-white border border-light-gray rounded-2xl p-10 shadow-sm text-center max-w-md">
            <PackageSearch className="w-12 h-12 text-accent-orange mb-4" />
            <p className="text-lg font-medium">
              No products found in this category.
            </p>
            <p className="text-sm text-black/60 mt-1">
              Try exploring other categories.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
