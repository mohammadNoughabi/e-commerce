import api from "../../api/api";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const ProductPage = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  const { id } = useParams(); 
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const relatedSliderRef = useRef(null);

  console.log(id);

  const fetchData = async () => {
    try {
      // Fetch product by _id
      const productResponse = await api.get(`/api/product/${id}`);
      const productData = productResponse.data.product;

      // Fetch category
      const categoryResponse = await api.get(
        `/api/category/${productData.categoryId}`
      );

      setProduct(productData);
      setCategory(categoryResponse.data.category);
      setRelatedProducts(
        productResponse.data.relatedProducts.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.log(error);
      setProduct(null);
      setCategory(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleWhatsAppMessage = () => {
    if (!product) return;
    const whatsappUrl = `https://wa.me/989124937456?text=Hi, I'm interested in ${product.title}`;
    window.open(whatsappUrl, "_blank");
  };

  const nextImage = () => {
    if (product) {
      const images = [product.image, ...(product.gallery || [])];
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      const images = [product.image, ...(product.gallery || [])];
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    if (product && product.gallery && product.gallery.length > 0) {
      const interval = setInterval(nextImage, 5000);
      return () => clearInterval(interval);
    }
  }, [product, currentImageIndex]);

  const scrollRelated = (direction) => {
    if (relatedSliderRef.current) {
      const cardWidth =
        window.innerWidth < 640 ? 192 : window.innerWidth < 768 ? 224 : 256;
      const scrollAmount = cardWidth + 16;
      relatedSliderRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-blue">
        <div className="animate-pulse text-lg">Loading product details...</div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])];

  // ✅ JSON-LD Structured Data
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: allImages.map(
      (img) => `${apiBase}/uploads/products/${product._id}/${img}`
    ),
    description: product.shortDescription || product.title,
    sku: product._id.slice(-6).toUpperCase(),
    brand: {
      "@type": "Brand",
      name: "YourBrand",
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Inject JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      {/* Breadcrumb */}
      <nav className="text-sm breadcrumbs mb-6" aria-label="Breadcrumb">
        <ul className="flex space-x-2 text-gray-600">
          <li>
            <Link to="/shop" className="hover:text-accent-orange">
              Shop
            </Link>
          </li>
          <li>
            <Link
              to={`/category/${category._id}`}
              className="hover:text-accent-orange"
            >
              {category.title}
            </Link>
          </li>
          <li>/</li>
          <li className="text-dark-blue font-medium truncate max-w-xs">
            {product.title}
          </li>
        </ul>
      </nav>

      {/* Product Section */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-md p-4 md:p-6 mb-12">
        {/* Image Slider */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl group">
            <div className="relative aspect-square">
              <img
                src={`${apiBase}/uploads/products/${product.title}/${allImages[currentImageIndex]}`}
                alt={product.title}
                className="w-full h-full object-cover rounded-xl transition-opacity duration-300"
                loading="eager"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-dark-blue" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-dark-blue" />
                  </button>
                </>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 w-full max-w-md">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    i === currentImageIndex
                      ? "border-accent-orange scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={`${apiBase}/uploads/products/${product.title}/${img}`}
                    alt={`${product.title} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dark-blue mb-2">
              {product.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="mr-3">
                SKU: {product._id.slice(-6).toUpperCase()}
              </span>
              <span>•</span>
              <span className="ml-3">In Stock</span>
            </div>

            <div
              className="text-base text-gray-700 mb-6 product-description text-justify"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div>
            <div className="flex items-center mb-6">
              <p className="text-2xl md:text-3xl font-bold text-accent-orange">
                ${product.price}
              </p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="ml-3 text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </p>
                )}
            </div>

            <button
              onClick={handleWhatsAppMessage}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Message on WhatsApp
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Typically replies within minutes
            </p>
          </div>
        </div>
      </article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12" aria-labelledby="related-products-heading">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="related-products-heading"
              className="text-xl md:text-2xl font-bold text-dark-blue"
            >
              Related Products
            </h2>

            {relatedProducts.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRelated("left")}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Scroll related products left"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollRelated("right")}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Scroll related products right"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={relatedSliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-6"
            style={{ scrollBehavior: "smooth" }}
          >
            {relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                to={`/product/${rp._id}`}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-white shadow rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition snap-start"
                aria-label={`View ${rp.title}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`${apiBase}/uploads/products/${rp._id}/${rp.image}`}
                    alt={rp.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-dark-blue line-clamp-2 h-12 mb-2">
                    {rp.title}
                  </h3>
                  <p className="text-accent-orange font-bold">${rp.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
