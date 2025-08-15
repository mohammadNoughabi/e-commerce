import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import authReducer from "./auth/authSlice";
import blogReducer from "./blog/blogSlice";
import categoryReducer from "./category/categorySlice";
import productReducer from "./product/productSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    blog: blogReducer,
    category: categoryReducer,
    product: productReducer,
  },
});
