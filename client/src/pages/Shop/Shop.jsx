import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, ShoppingBag } from "lucide-react";

const Shop = () => {
  const categories = useSelector((state) => state.category.categories);
  const apiBase = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

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
    <main className="min-h-screen bg-light-gray pt-12 pb-16 px-6">
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
        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <ShoppingBag className="w-8 h-8 text-accent-orange" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-dark-blue tracking-wide">
            Shop Categories
          </h1>
        </div>

        {/* Loading / Empty states */}
        {!categories ? (
          <p className="text-center text-gray-600">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-600">
            No categories available at the moment.
          </p>
        ) : (
          /* Grid */
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {categories.map((cat) => (
              <article
                key={cat._id}
                className="group bg-white rounded-xl overflow-hidden border border-light-gray shadow-sm hover:shadow-lg hover:border-accent-orange transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-32 md:h-36 overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/categories/${cat.title}/${cat.image}`}
                    alt={`Shop category: ${cat.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-3 md:p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h2 className="text-base md:text-lg font-semibold text-dark-blue mb-1 group-hover:text-accent-orange transition-colors duration-300">
                      {cat.title}
                    </h2>
                    <p
                      className="text-xs md:text-sm text-black/70 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: cat.description }}
                    ></p>
                  </div>

                  <button
                    aria-label={`Explore ${cat.title}`}
                    className="mt-auto w-full py-1.5 flex items-center justify-center gap-2 rounded-md bg-accent-orange cursor-pointer text-dark-blue text-sm font-medium hover:bg-dark-blue hover:text-white transition-colors duration-300 shadow-sm hover:shadow-accent-orange/30"
                    onClick={() => {
                      navigate(`/category/${cat._id}`);
                    }}
                  >
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
