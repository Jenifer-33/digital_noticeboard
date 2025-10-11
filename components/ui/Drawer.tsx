import { Newspaper, X } from "lucide-react";
import { Fragment } from "react";

export const Drawer = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <Fragment>
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-30">
        <div
          id="drawer-form"
          className="fixed z-40 p-4 bg-white opacity-100 rounded-lg w-90 sm:w-150 top-0 right-0 mt-5 mb-5 mr-5 min-h-[90vh]"
          tabIndex={-1}
          aria-labelledby="drawer-form-label"
        >
          <h5
            id="drawer-label"
            className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
          >
            <Newspaper className="w-4 h-4 mr-2" />
            Headline
          </h5>
          <button
            onClick={onClose}
            type="button"
            data-drawer-hide="drawer-form"
            aria-controls="drawer-form"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="overflow-y-auto max-h-[80vh]">{children}</div>
        </div>
      </div>
    </Fragment>
  );
};
