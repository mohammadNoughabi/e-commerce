import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import authReducer from "./auth/authSlice";
import categoryReducer from "./category/categorySlice";
import productReducer from "./product/productSlice";
import modalReducer from "./Modal/modalSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    product: productReducer,
    modal: modalReducer,
  },
});
