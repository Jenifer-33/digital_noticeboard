export const Modal = ({
  title,
  content,
  onConfirm,
  onClose,
  confirmText,
  closeText,
  isDelete,
}: {
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  confirmText: string;
  closeText: string;
  isDelete: boolean;
}) => {
  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full fixed inset-0 bg-black/50 bg-opacity-50 z-30"
    >
      <div className="relative p-4 w-screen max-w-2xl max-h-full text-center min-w-full items-center justify-center flex">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-white w-[600px]">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-200 border-gray-200">
            <h3 className="text-xl font-semibold text-[#e66030]">{title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-black p-4">
              {content}
            </p>
          </div>
          {/* Modal footer */}
          <div className="flex items-center gap-4 justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-200 justify-end">
            <button
              data-modal-hide="default-modal"
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-gray-800 focus:z-10 focus:ring-4 focus:ring-gray-100 cursor-pointer"
            >
              {closeText}
            </button>
            <button
              data-modal-hide="default-modal"
              type="button"
              className={`text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer ${
                isDelete
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
