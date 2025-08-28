import { useState, useEffect } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const SearchBar = ({ isMobile = false, isExpanded = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(isExpanded);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setProducts([]);
      setCategories([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const searchTimer = setTimeout(async () => {
      try {
        const response = await api.get(`/api/search?searchItem=${searchTerm}`);
        setProducts(response.data.products || []);
        setCategories(response.data.categories || []);
        setHasSearched(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is now handled by the useEffect
  };

  // Mobile collapsed: show just icon
  if (isMobile && !showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
        aria-label="Open search"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    );
  }

  // Expanded (desktop or mobile menu)
  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          {/* Close button for mobile */}
          {isMobile && (
            <button
              type="button"
              onClick={() => {
                setShowInput(false);
                setSearchTerm("");
                setHasSearched(false);
              }}
              className="absolute left-3 text-gray-500 hover:text-red-500 transition-colors duration-200 z-10"
              aria-label="Close search"
            >
              ✕
            </button>
          )}

          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 ${
              isMobile ? "pl-10 pr-12" : "pl-4 pr-12"
            } rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm`}
            autoFocus={isMobile}
          />

          <button
            type="submit"
            className="absolute right-2 p-1.5 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
            aria-label="Search"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Results dropdown */}
      {searchTerm && (
        <div className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 max-h-72 overflow-y-auto transition-all duration-300">
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-gray-600">Searching...</span>
            </div>
          ) : (
            <>
              {products.length === 0 && categories.length === 0 && hasSearched ? (
                <div className="p-4 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No results found for "{searchTerm}"</p>
                </div>
              ) : (
                <>
                  {products.length > 0 && (
                    <div>
                      <h4 className="px-4 py-3 font-semibold text-sm text-gray-700 bg-gray-50 border-b border-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Products ({products.length})
                      </h4>
                      <ul>
                        {products.map((p) => (
                          <li
                            key={p._id}
                            className="px-4 py-3 hover:bg-orange-50 border-b border-gray-100 transition-colors duration-150"
                          >
                            <Link
                              to={`/product/${p._id}`}
                              className="block w-full text-gray-800 hover:text-orange-600 transition-colors duration-150"
                              onClick={() => {
                                setSearchTerm("");
                                setHasSearched(false);
                              }}
                            >
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div>
                      <h4 className="px-4 py-3 font-semibold text-sm text-gray-700 bg-gray-50 border-b border-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Categories ({categories.length})
                      </h4>
                      <ul>
                        {categories.map((c) => (
                          <li
                            key={c._id}
                            className="px-4 py-3 hover:bg-orange-50 border-b border-gray-100 transition-colors duration-150"
                          >
                            <Link
                              to={`/category/${c._id}`}
                              className="block w-full text-gray-800 hover:text-orange-600 transition-colors duration-150"
                              onClick={() => {
                                setSearchTerm("");
                                setHasSearched(false);
                              }}
                            >
                              {c.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;