import AppRoutes from "../../routes/AppRoutes";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../api/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/auth/authSlice";
import { setCategories } from "../../store/category/categorySlice";
import { setProducts } from "../../store/product/productSlice";
import { setBlogs } from "../../store/blog/blogSlice";
import useModal from "../../hooks/useModal";

const App = () => {
  const dispatch = useDispatch();
  const { showModal } = useModal();
  const { isAuthenticated } = useSelector((state) => state.auth);

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

  const fetchCategories = async () => {
    try {
      let response = await api.get("/api/category");
      if (response.status === 200) {
        dispatch(setCategories(response.data.categories));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      let response = await api.get("/api/product");
      if (response.status === 200) {
        dispatch(setProducts(response.data.products));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      let response = await api.get("/api/blog");
      if (response.status === 200) {
        dispatch(setBlogs(response.data.blogs));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyAuth();
    fetchCategories();
    fetchProducts();
    fetchBlogs();
  }, [dispatch, isAuthenticated]);

  return (
    <div>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <AppRoutes />
      <div className="relative bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default App;
