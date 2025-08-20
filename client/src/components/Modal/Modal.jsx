import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/Modal/modalSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttonText } = useSelector(
    (state) => state.modal
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white text-dark-blue rounded-2xl shadow-lg max-w-md w-full p-6 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Close Button (top right) */}
            <button
              onClick={() => dispatch(closeModal())}
              className="absolute top-3 right-3 text-dark-blue hover:text-accent-orange"
            >
              ✕
            </button>

            {/* Title */}
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

            {/* Message */}
            {message && <p className="text-base mb-6">{message}</p>}

            {/* Action Button */}
            <button
              onClick={() => dispatch(closeModal())}
              className="bg-accent-orange text-dark-blue px-4 py-2 rounded-lg shadow-md hover:opacity-90"
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
