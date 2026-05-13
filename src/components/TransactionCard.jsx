import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

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
        <div className="group flex items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                {/* Category Icon */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                    isIncome ? "bg-emerald-50 group-hover:bg-emerald-100" : "bg-red-50 group-hover:bg-red-100"
                }`}>
                    {(transaction.icon || transaction.categoryIcon) ? (
                        (transaction.icon || transaction.categoryIcon).startsWith('http') || (transaction.icon || transaction.categoryIcon).startsWith('data:') ? (
                            <img src={transaction.icon || transaction.categoryIcon} alt={transaction.name || transaction.categoryName} className="w-5 h-5 object-contain" />
                        ) : (
                            <span className="text-xl">{transaction.icon || transaction.categoryIcon}</span>
                        )
                    ) : (
                        <span className={`font-bold text-sm ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                            {(transaction.name || transaction.description || transaction.categoryName || "T").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate capitalize">
                        {transaction.name || transaction.description || transaction.categoryName || "No description"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-medium">{formatDate(transaction.date)}</span>
                        {transaction.categoryName && (
                            <>
                                <span className="text-gray-200">•</span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                                    isIncome ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
                                }`}>
                                    {transaction.categoryName}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Amount Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${
                    isIncome ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                }`}>
                    {isIncome ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{isIncome ? "+" : "-"}₹{Number(transaction.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;