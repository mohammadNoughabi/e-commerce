import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "../store/Modal/modalSlice";

const useModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);

  const showModal = ({ title, message, buttons }) => {
    dispatch(openModal({ title, message, buttons }));
  };

  const hideModal = () => {
    dispatch(closeModal());
  };

  return {
    isModalOpen: modalState.isOpen,
    showModal,
    hideModal,
    modalContent: {
      title: modalState.title,
      message: modalState.message,
      buttons: modalState.buttons,
    },
  };
};

export default useModal;
