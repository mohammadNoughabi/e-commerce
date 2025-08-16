import AppRoutes from "../../routes/AppRoutes";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../api/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/auth/authSlice";
import { setUsers } from "../../store/user/userSlice";
import { setCategories } from "../../store/category/categorySlice";
import { setProducts } from "../../store/product/productSlice";
import { setBlogs } from "../../store/blog/blogSlice";

const App = () => {
  const dispatch = useDispatch();

  const validateToken = async () => {
    try {
      const response = await api.get("/api/auth/validate-token");
      const { userId, userRole } = response.data;
      dispatch(login({ userId, userRole }));
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
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
    validateToken();
    fetchCategories();
    fetchProducts();
    fetchBlogs();
  }, [dispatch]);

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
