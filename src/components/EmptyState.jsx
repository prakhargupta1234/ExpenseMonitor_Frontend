import { Plus } from "lucide-react";

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
            {Icon && (
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-5 animate-float">
                    <Icon className="w-9 h-9 text-gray-300" />
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-700 mb-1.5">{title}</h3>
            {description && (
                <p className="text-sm text-gray-400 text-center max-w-sm mb-5 leading-relaxed">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 text-sm font-semibold shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-[0.97]"
                >
                    <Plus size={16} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;