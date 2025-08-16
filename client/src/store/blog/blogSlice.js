import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action) => {
      state.blogs = state.blogs.push(action.payload);
    },
    removeBlog: (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, removeBlog } = blogSlice.actions;

export default blogSlice.reducer;
