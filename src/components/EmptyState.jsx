const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
            {Icon && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;