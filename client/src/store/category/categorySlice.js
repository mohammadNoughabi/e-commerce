import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories = state.categories.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      );
    }
  },
});

export const { setCategories, addCategory, removeCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
