import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AppRoutes from "../../routes/AppRoutes";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Modal from "../Modal/Modal";
import api from "../../api/api";
import { login, logout } from "../../store/auth/authSlice";
import { setCategories } from "../../store/category/categorySlice";
import { setProducts } from "../../store/product/productSlice";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation(); // For handling scroll on route change

  // Verify authentication
  const verifyAuth = async () => {
    try {
      const response = await api.get("/api/auth/verify", {
        credentials: "include",
      });
      if (response.data.isAuthenticated) {
        dispatch(
          login({
            userId: response.data.userId,
            userRole: response.data.userRole,
          })
        );
      }
    } catch (error) {
      dispatch(logout());
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/category");
      if (response.status === 200) {
        dispatch(setCategories(response.data.categories));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product");
      if (response.status === 200) {
        dispatch(setProducts(response.data.products));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle initial data fetching and auth verification
  useEffect(() => {
    verifyAuth();
    fetchCategories();
    fetchProducts();
  }, [dispatch, isAuthenticated]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Modal */}
      <Modal />

      {/* Navbar */}
      <div className="sticky top-0 z-50 shadow-lg">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AppRoutes />
      </main>

      {/* Footer */}
      <footer className="bg-dark-blue text-white">
        <Footer />
      </footer>
    </div>
  );
};

export default App;