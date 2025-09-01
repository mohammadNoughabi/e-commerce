import api from "../../api/api";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ProductPage = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const relatedSliderRef = useRef(null);

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
        productResponse.data.relatedProducts.filter((item) => item._id !== id)
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
    const message = `Hi, I'm interested in ${product.title} (${window.location.href})`;
    const whatsappUrl = `https://wa.me/989124937456?text=${encodeURIComponent(
      message
    )}`;
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
      <div className="flex items-center justify-center min-h-screen text-dark-blue">
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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Inject JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

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
          <span>/</span>
          <span className="text-dark-blue font-medium truncate max-w-xs">
            {product.title}
          </span>
        </div>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-dark-blue hover:text-accent-orange mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* Product Section */}
      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-6 mb-12 border border-light-gray">
        {/* Image Slider */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl group">
            <div className="relative aspect-square bg-light-gray rounded-xl">
              <img
                src={`${apiBase}/uploads/products/${product.title}/${allImages[currentImageIndex]}`}
                alt={product.title}
                className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="eager"
                onLoad={() => setImageLoaded(true)}
              />

              {!imageLoaded && (
                <div className="absolute inset-0 bg-light-gray animate-pulse rounded-xl"></div>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-dark-blue" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-dark-blue" />
                  </button>
                </>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-dark-blue/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2 w-full max-w-md">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    i === currentImageIndex
                      ? "border-accent-orange scale-105"
                      : "border-light-gray hover:border-dark-blue/30"
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === currentImageIndex ? "true" : "false"}
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
            <h1 className="text-2xl md:text-3xl font-bold text-dark-blue mb-3">
              {product.title}
            </h1>

            <div className="flex items-center text-sm text-dark-blue/60 mb-6">
              <span className="mr-4 flex items-center">
                <CheckIcon className="w-4 h-4 mr-1 text-accent-orange" />
                SKU: {product._id.slice(-6).toUpperCase()}
              </span>
              <span className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-1 text-accent-orange" />
                In Stock
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-6">
              <p className="text-3xl md:text-4xl font-bold text-accent-orange">
                ${product.price}
              </p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="ml-4 text-lg text-dark-blue/60 line-through">
                    ${product.originalPrice}
                  </p>
                )}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-dark-blue/80">
                <TruckIcon className="w-5 h-5 mr-2 text-accent-orange" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center text-dark-blue/80">
                <ArrowPathIcon className="w-5 h-5 mr-2 text-accent-orange" />
                <span className="text-sm">30-Day Returns</span>
              </div>
              <div className="flex items-center text-dark-blue/80">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-accent-orange" />
                <span className="text-sm">2-Year Warranty</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-dark-blue mb-3">
                Description
              </h3>
              <div
                className="text-dark-blue/80 leading-relaxed product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-light-gray/30 rounded-xl p-6">
            <button
              onClick={handleWhatsAppMessage}
              className="w-full cursor-pointer flex items-center justify-center gap-3 bg-accent-orange text-dark-blue px-6 py-4 rounded-xl font-semibold hover:bg-accent-orange/90 transition-all shadow-md hover:shadow-lg mb-3"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              Message on WhatsApp
            </button>

            <p className="text-center text-sm text-dark-blue/60">
              <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
              Secure transaction • Typically replies within minutes
            </p>
          </div>
        </div>
      </article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16" aria-labelledby="related-products-heading">
          <div className="flex items-center justify-between mb-8">
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
                  className="p-2 rounded-full cursor-pointer bg-light-gray hover:bg-dark-blue/10 transition"
                  aria-label="Scroll related products left"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-dark-blue" />
                </button>
                <button
                  onClick={() => scrollRelated("right")}
                  className="p-2 rounded-full bg-light-gray cursor-pointer hover:bg-dark-blue/10 transition"
                  aria-label="Scroll related products right"
                >
                  <ChevronRightIcon className="w-5 h-5 text-dark-blue" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={relatedSliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-8"
            style={{ scrollBehavior: "smooth" }}
          >
            {relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                to={`/product/${rp._id}`}
                className="flex-shrink-0 w-64 bg-white shadow-sm rounded-xl overflow-hidden border border-light-gray hover:shadow-md transition-all hover:border-accent-orange/30"
                aria-label={`View ${rp.title}`}
              >
                <div className="aspect-square overflow-hidden bg-light-gray">
                  <img
                    src={`${apiBase}/uploads/products/${rp.title}/${rp.image}`}
                    alt={rp.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-dark-blue line-clamp-2 mb-2">
                    {rp.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-accent-orange font-bold text-lg">
                      ${rp.price}
                    </p>
                    <span className="text-dark-blue/60 text-sm">
                      View Details
                    </span>
                  </div>
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
