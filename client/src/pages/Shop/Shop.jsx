import { useSelector } from "react-redux";

const Shop = () => {
  const categories = useSelector((state) => state.category.categories);
  const apiBase = import.meta.env.VITE_API_BASE;

  return (
    <div className="min-h-screen bg-light-gray pt-12 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-14 text-dark-blue tracking-wide text-accent-orange">
          Shop
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories?.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-xl overflow-hidden border border-light-gray shadow-sm hover:shadow-lg hover:border-accent-orange transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 md:h-44 overflow-hidden">
                <img
                  src={`${apiBase}/uploads/categories/${cat.title}/${cat.image}`}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 flex flex-col justify-between h-[180px]">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-dark-blue mb-2">
                    {cat.title}
                  </h2>
                  <p className="text-black/70 text-sm md:text-base mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <button className="w-full py-2 rounded-lg bg-accent-orange text-dark-blue font-semibold hover:bg-dark-blue hover:text-white transition-colors duration-300 shadow-md hover:shadow-accent-orange/40">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
