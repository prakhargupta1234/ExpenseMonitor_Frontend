import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import TransactionCard from "../components/TransactionCard";
import EmptyState from "../components/EmptyState";
import PageLoader from "../components/PageLoader";

const Filter = () => {
    useUser();

    const [type, setType] = useState("spendings");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleFilter = async (e) => {
        e?.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Please select both Start Date and End Date");
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const payload = { 
                type: type === "earnings" ? "INCOME" : "EXPENSE",
                categoryType: type === "earnings" ? "INCOME" : "EXPENSE",
                transactionType: type === "earnings" ? "INCOME" : "EXPENSE",
                startDate,
                endDate 
            };
            
            if (keyword.trim()) {
                payload.keyword = keyword.trim();
                payload.description = keyword.trim();
            }
            if (sortField) payload.sortField = sortField;
            if (sortOrder) payload.sortOrder = sortOrder;

            const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, payload);
            setResults(response.data || []);
        } catch (error) {
            console.error("Failed to filter:", error);
            toast.error(error.response?.data?.message || "Failed to filter transactions");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setType("spendings");
        setStartDate("");
        setEndDate("");
        setKeyword("");
        setSortField("date");
        setSortOrder("desc");
        setResults([]);
        setHasSearched(false);
    };

    const total = results.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <div>
            <Dashboard activeMenu="Analytics">
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Filter Transactions</h2>
                        <p className="text-sm text-gray-500 mt-1">Search and analyze your financial data</p>
                    </div>

                    {/* Filter Form */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm mb-6 animate-scale-in">
                        <form onSubmit={handleFilter}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                                {/* Type Toggle */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setType("earnings")}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${type === "earnings"
                                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                }`}
                                        >
                                            <TrendingUp size={14} />
                                            Earnings
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setType("spendings")}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${type === "spendings"
                                                    ? "bg-red-600 text-white shadow-md shadow-red-100"
                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                }`}
                                        >
                                            <TrendingDown size={14} />
                                            Spendings
                                        </button>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm bg-white"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm bg-white"
                                    />
                                </div>

                                {/* Keyword */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Keyword</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="Search by description..."
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Sort Field */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm bg-white appearance-none"
                                    >
                                        <option value="date">Date</option>
                                        <option value="amount">Amount</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Order</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("desc")}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${sortOrder === "desc"
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                }`}
                                        >
                                            <ArrowUpDown size={14} />
                                            Newest
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("asc")}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${sortOrder === "asc"
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                }`}
                                        >
                                            <ArrowUpDown size={14} />
                                            Oldest
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-semibold"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.97]"
                                >
                                    <SlidersHorizontal size={15} />
                                    Apply Filters
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <PageLoader />
                    ) : hasSearched ? (
                        <>
                            {/* Results Summary */}
                            {results.length > 0 && (
                                <div className={`${type === "earnings" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"} border rounded-xl p-4 mb-5 flex items-center justify-between animate-scale-in`}>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {results.length} result{results.length !== 1 ? "s" : ""} found
                                    </p>
                                    <p className={`font-bold text-lg ${type === "earnings" ? "text-emerald-700" : "text-red-700"}`}>
                                        {type === "earnings" ? "+" : "-"}₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}

                            {results.length === 0 ? (
                                <EmptyState
                                    icon={SlidersHorizontal}
                                    title="No results found"
                                    description="Try adjusting your filters to find what you're looking for."
                                />
                            ) : (
                                <div className="space-y-2 stagger-children">
                                    {results.map((item) => (
                                        <TransactionCard
                                            key={item.id}
                                            transaction={item}
                                            type={type}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                                <SlidersHorizontal className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">Set your filters above and click "Apply Filters" to search</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    );
};

export default Filter;