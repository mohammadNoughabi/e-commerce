// components/Modal.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../store/Modal/modalSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttons } = useSelector(
    (state) => state.modal
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Modal header */}
        <div className="bg-dark-blue p-4">
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>

        {/* Modal body */}
        <div className="p-6">
          <p className="text-dark-blue">{message}</p>
        </div>

        {/* Modal footer */}
        <div className="bg-light-gray px-4 py-3 flex justify-end space-x-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                if (button.onClick) button.onClick();
                dispatch(closeModal());
              }}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                button.color === "accent-orange"
                  ? "bg-accent-orange text-dark-blue hover:bg-opacity-90"
                  : button.color === "dark-blue"
                  ? "bg-dark-blue text-white hover:bg-opacity-90"
                  : button.color === "black"
                  ? "bg-black text-white hover:bg-opacity-90"
                  : "bg-white text-dark-blue border border-light-gray hover:bg-light-gray"
              }`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
