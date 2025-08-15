import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userRole: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },
    loginFilure: (state, action) => {
      state.userId = null;
      state.userRole = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.userId = null;
      state.userRole = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { loginSuccess, loginFailure, logout , setLoading } = authSlice.actions;
export default authSlice.reducer;
