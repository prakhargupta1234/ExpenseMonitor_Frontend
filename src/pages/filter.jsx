import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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

    const [type, setType] = useState("expense");
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

        // Validation: Dates are mandatory
        if (!startDate || !endDate) {
            toast.error("Please select both Start Date and End Date");
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const payload = { 
                type: type.toUpperCase(),
                categoryType: type.toUpperCase(),
                transactionType: type.toUpperCase(),
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
        setType("expense");
        setStartDate("");
        setEndDate("");
        setKeyword("");
        setSortField("date");
        setSortOrder("desc");
        setResults([]);
        setHasSearched(false);
    };

    // Calculate total
    const total = results.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <div>
            <Dashboard activeMenu="Filters">
                <div className="my-5 mx-auto">
                    <h2 className="text-2xl font-semibold mb-5">Filter Transactions</h2>

                    {/* Filter Form */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
                        <form onSubmit={handleFilter}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {/* Type Toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setType("income")}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${type === "income"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            Income
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setType("expense")}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${type === "expense"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-black transition-colors text-sm"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-black transition-colors text-sm"
                                    />
                                </div>

                                {/* Keyword */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="Search by description..."
                                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-gray-700 focus:outline-none focus:border-black transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Sort Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-black transition-colors text-sm bg-white"
                                    >
                                        <option value="date">Date</option>
                                        <option value="amount">Amount</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("desc")}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${sortOrder === "desc"
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            <ArrowUpDown size={14} />
                                            Newest
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("asc")}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${sortOrder === "asc"
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
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
                                <div className={`${type === "income" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"} border rounded-xl p-4 mb-5 flex items-center justify-between`}>
                                    <p className="text-sm font-medium text-gray-700">
                                        {results.length} result{results.length !== 1 ? "s" : ""} found
                                    </p>
                                    <p className={`font-bold ${type === "income" ? "text-green-700" : "text-red-700"}`}>
                                        {type === "income" ? "+" : "-"}₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                                <div className="space-y-2">
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
                        <div className="text-center py-16">
                            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">Set your filters above and click "Apply Filters" to search</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    );
};

export default Filter;