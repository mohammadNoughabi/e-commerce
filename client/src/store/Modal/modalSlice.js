// features/modal/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  buttons: []
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.buttons = action.payload.buttons || [];
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.message = '';
      state.buttons = [];
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;