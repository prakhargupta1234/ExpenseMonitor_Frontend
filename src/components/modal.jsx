import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;