import useModal from "../../hooks/useModal";

const Modal = () => {
  const { isModalOpen, hideModal, modalContent } = useModal();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {modalContent.title && <h2 className="text-xl font-bold mb-4">{modalContent.title}</h2>}
        {modalContent.message && <p className="mb-6">{modalContent.message}</p>}
        
        <div className="flex justify-end space-x-3">
          {modalContent.buttons.length > 0 ? (
            modalContent.buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick?.();
                  hideModal();
                }}
                className={`px-4 py-2 rounded ${button.className || 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {button.text}
              </button>
            ))
          ) : (
            <button
              onClick={hideModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;