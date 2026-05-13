import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, hideCloseButton = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={!hideCloseButton ? onClose : undefined}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in">
                <div className="flex items-center justify-between p-5 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {!hideCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;