import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userRole: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.userRole = null;
      state.isAuthenticated = false;
    }
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
