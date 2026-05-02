import { Trash2 } from "lucide-react";

const TransactionCard = ({ transaction, onDelete, type }) => {
    const isIncome = type === "income";

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="group flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white">
            <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                {/* Category Icon */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg ${isIncome ? "bg-green-50" : "bg-red-50"
                    }`}>
                    {(transaction.icon || transaction.categoryIcon) ? (
                        (transaction.icon || transaction.categoryIcon).startsWith('http') || (transaction.icon || transaction.categoryIcon).startsWith('data:') ? (
                            <img src={transaction.icon || transaction.categoryIcon} alt={transaction.name || transaction.categoryName} className="w-5 h-5 object-contain" />
                        ) : (
                            <span>{transaction.icon || transaction.categoryIcon}</span>
                        )
                    ) : (
                        <span className="text-gray-500 font-medium text-sm">
                            {(transaction.name || transaction.description || transaction.categoryName || "T").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                        {transaction.name || transaction.description || transaction.categoryName || "No description"}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                        {transaction.categoryName && (
                            <>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{transaction.categoryName}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Amount */}
                <span className={`font-semibold text-sm ${isIncome ? "text-green-600" : "text-red-600"
                    }`}>
                    {isIncome ? "+" : "-"}₹{Number(transaction.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>

                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Delete"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;