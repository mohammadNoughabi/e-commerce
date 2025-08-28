import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const Slider = ({ items }) => {
  const apiBase = import.meta.env.VITE_API_BASE || "";
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image+Available";

  const handleImageLoad = () => setLoading(false);

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-dark-blue py-8">
        No products available
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="!overflow-visible"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="flex">
            {/* Card */}
            <Link to={`/product/${item._id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col h-full w-full">
                {/* Image wrapper with fixed height */}
                <div className="h-52 w-full flex items-center justify-center mb-4 relative">
                  {loading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
                  )}
                  <img
                    src={
                      item.image
                        ? `${apiBase}/Uploads/products/${item.title}/${item.image}`
                        : fallbackImage
                    }
                    alt={item.title || "Product"}
                    className={`h-full w-full object-contain rounded-lg transition-opacity duration-500 ${
                      loading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>

                {/* Text wrapper */}
                <div className="text-center flex flex-col flex-none">
                  <h2 className="text-lg sm:text-xl font-bold text-dark-blue line-clamp-2">
                    {item.title || "Untitled Product"}
                  </h2>
                  <p
                    className="text-sm text-gray-600 mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
