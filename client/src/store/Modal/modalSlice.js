import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  buttonText: "Close",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { title, message, buttonText } = action.payload;
      state.isOpen = true;
      state.title = title || "";
      state.message = message || "";
      state.buttonText = buttonText || "Close";
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.buttonText = "Close";
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
